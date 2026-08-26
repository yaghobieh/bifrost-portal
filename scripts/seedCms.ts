import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { DOC_PAGES } from './portalDocs.seed';
import { LANDING_PAYLOAD, SITE_PAGES_SEED } from './portalPages.seed';
import {
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_DOCS_COLLECTION,
  CMS_DOCS_LOCALE,
  CMS_HOME_COLLECTION,
  CMS_HOME_SLUG,
  CMS_PAGES_COLLECTION,
  CMS_HOME_TITLE,
  CREW_ROLES,
  DEFAULT_JWT_SECRET,
  PAGE_KIND_ARTICLE,
  PAGE_KIND_DOC,
  PAGE_KIND_LANDING,
  PROVIDER_PASSWORD,
  USER_PLAN_FREE,
  USER_ROLE_USER,
  VIEWER_CREW_SLUG,
  VIEWER_EMAIL,
  VIEWER_NAME,
  VIEWER_PASSWORD,
  VIEWER_USERNAME,
} from './seedCms.const';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL ?? '';
const JWT_SECRET = process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;

const hashPassword = (password: string): string =>
  createHash('sha256').update(`${JWT_SECRET}:${password}`).digest('hex');

const run = async () => {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const sql = neon(DATABASE_URL);
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT,
      provider TEXT NOT NULL DEFAULT 'password',
      provider_id TEXT,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'crm_admin')),
      username TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique_idx
    ON users (username)
    WHERE username IS NOT NULL
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'ai')),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_content (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      collection TEXT NOT NULL,
      slug TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'en',
      title TEXT NOT NULL DEFAULT '',
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (collection, slug, locale)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS cms_content_collection_idx ON cms_content (collection)`;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_kv (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT 'null'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
      system BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_user_roles (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID NOT NULL REFERENCES cms_roles(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, role_id)
    )
  `;

  for (const role of CREW_ROLES) {
    const permissionsJson = JSON.stringify(role.permissions);
    await sql`
      INSERT INTO cms_roles (slug, name, description, permissions, system)
      VALUES (${role.slug}, ${role.name}, ${role.description}, ${permissionsJson}::jsonb, ${role.system})
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        permissions = EXCLUDED.permissions,
        system = EXCLUDED.system,
        updated_at = NOW()
    `;
  }

  const pages = Object.values(DOC_PAGES);
  for (const page of pages) {
    const payloadJson = JSON.stringify({
      kind: PAGE_KIND_DOC,
      lead: page.lead,
      crumb: page.crumb,
      sections: page.sections,
      prev: page.prev ?? null,
      next: page.next ?? null,
    });
    await sql`
      INSERT INTO cms_content (collection, slug, locale, title, payload, status)
      VALUES (
        ${CMS_PAGES_COLLECTION},
        ${page.slug},
        ${CMS_DOCS_LOCALE},
        ${page.title},
        ${payloadJson}::jsonb,
        ${CMS_CONTENT_STATUS_PUBLISHED}
      )
      ON CONFLICT (collection, slug, locale)
      DO UPDATE SET
        title = EXCLUDED.title,
        payload = EXCLUDED.payload,
        status = EXCLUDED.status,
        updated_at = NOW()
    `;
  }

  const landingJson = JSON.stringify({ kind: PAGE_KIND_LANDING, ...LANDING_PAYLOAD });
  await sql`
    INSERT INTO cms_content (collection, slug, locale, title, payload, status)
    VALUES (
      ${CMS_PAGES_COLLECTION},
      ${CMS_HOME_SLUG},
      ${CMS_DOCS_LOCALE},
      ${CMS_HOME_TITLE},
      ${landingJson}::jsonb,
      ${CMS_CONTENT_STATUS_PUBLISHED}
    )
    ON CONFLICT (collection, slug, locale)
    DO UPDATE SET
      title = EXCLUDED.title,
      payload = EXCLUDED.payload,
      status = EXCLUDED.status,
      updated_at = NOW()
  `;

  for (const sitePage of SITE_PAGES_SEED) {
    const sitePayloadJson = JSON.stringify({ kind: PAGE_KIND_ARTICLE, ...sitePage.payload });
    await sql`
      INSERT INTO cms_content (collection, slug, locale, title, payload, status)
      VALUES (
        ${CMS_PAGES_COLLECTION},
        ${sitePage.slug},
        ${CMS_DOCS_LOCALE},
        ${sitePage.title},
        ${sitePayloadJson}::jsonb,
        ${CMS_CONTENT_STATUS_PUBLISHED}
      )
      ON CONFLICT (collection, slug, locale)
      DO UPDATE SET
        title = EXCLUDED.title,
        payload = EXCLUDED.payload,
        status = EXCLUDED.status,
        updated_at = NOW()
    `;
  }

  await sql`DELETE FROM cms_content WHERE collection = ${CMS_DOCS_COLLECTION}`;
  await sql`DELETE FROM cms_content WHERE collection = ${CMS_HOME_COLLECTION}`;

  const passwordHash = hashPassword(VIEWER_PASSWORD);
  const rows = await sql`
    INSERT INTO users (email, name, username, password_hash, provider, role)
    VALUES (
      ${VIEWER_EMAIL},
      ${VIEWER_NAME},
      ${VIEWER_USERNAME},
      ${passwordHash},
      ${PROVIDER_PASSWORD},
      ${USER_ROLE_USER}
    )
    ON CONFLICT (email) DO UPDATE SET
      username = EXCLUDED.username,
      password_hash = EXCLUDED.password_hash,
      role = ${USER_ROLE_USER},
      name = EXCLUDED.name,
      updated_at = NOW()
    RETURNING id
  `;
  const user = Array.isArray(rows) ? rows[0] : null;
  if (!user || typeof user !== 'object' || !('id' in user)) {
    throw new Error('failed to seed viewer user');
  }
  const userId = String((user as { id: string }).id);

  await sql`
    INSERT INTO plans (user_id, plan)
    VALUES (${userId}, ${USER_PLAN_FREE})
    ON CONFLICT (user_id) DO UPDATE SET plan = ${USER_PLAN_FREE}, updated_at = NOW()
  `;

  const roleRows = await sql`
    SELECT id FROM cms_roles WHERE slug = ${VIEWER_CREW_SLUG} LIMIT 1
  `;
  const role = Array.isArray(roleRows) ? roleRows[0] : null;
  if (!role || typeof role !== 'object' || !('id' in role)) {
    throw new Error('failed to resolve guest role');
  }
  const roleId = String((role as { id: string }).id);
  await sql`DELETE FROM cms_user_roles WHERE user_id = ${userId}`;
  await sql`
    INSERT INTO cms_user_roles (user_id, role_id)
    VALUES (${userId}, ${roleId})
    ON CONFLICT (user_id, role_id) DO NOTHING
  `;

  console.log(
    `seeded ${pages.length} docs, landing, ${SITE_PAGES_SEED.length} site pages into pages, viewer ${VIEWER_USERNAME} (${VIEWER_CREW_SLUG})`,
  );
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
