export interface DocTable {
  headers: string[];
  rows: string[][];
}

export interface DocSection {
  id: string;
  heading: string;
  paragraphs: string[];
  callout?: string;
  code?: { lang: string; source: string };
  table?: DocTable;
}

export interface DocPageModel {
  slug: string;
  title: string;
  lead: string;
  crumb: string;
  sections: DocSection[];
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

const page = (
  slug: string,
  title: string,
  lead: string,
  crumb: string,
  sections: DocSection[],
  prev?: DocPageModel['prev'],
  next?: DocPageModel['next'],
): DocPageModel => ({ slug, title, lead, crumb, sections, prev, next });

export const DOC_PAGES: Record<string, DocPageModel> = {
  overview: page(
    'overview',
    'Overview',
    'Bifrost is the ForgeStack CMS. Ink is the editor library inside it. This site is the public docs — not the admin dashboard.',
    'Docs / Getting started / Overview',
    [
      {
        id: 'what',
        heading: 'What you get',
        paragraphs: [
          'Installment scaffolds a Nest API, a React admin (Bear + Compass + Synapse), and optional git plugins. Content lives in collections with a REST surface you can browse in the API Explorer and export to Postman.',
          'The public docs portal (this site) is a sibling app. After installment you can host it as Bifrost content. Until then it is a static Vite app with search, version pill, MCP, demo, and Ask AI.',
        ],
      },
      {
        id: 'roles',
        heading: 'Who it is for',
        paragraphs: [
          'Editors work on Stage: pages, drafts, publish. Engineers query collections with `@forgedevstack/bifrost-sdk` or REST. Admins create users (each user is an agent) and toggle a permission grid. Agents and Cursor talk to the same CMS through MCP.',
        ],
        table: {
          headers: ['Role', 'Starts here', 'Does not start here'],
          rows: [
            ['Editor', 'How to use → Stage', 'Pack levels, Nest routes'],
            ['Engineer', 'Installation → REST / SDK', 'Crew chat as a product'],
            ['Admin', 'Agents → Permissions', 'First-install pack levels'],
            ['Agent / Cursor', 'MCP → Ask AI', 'Writing secrets into git'],
          ],
        },
      },
      {
        id: 'separate',
        heading: 'Docs vs admin',
        paragraphs: [
          'The admin lives in Bifrost (`apps/cms-fe`) and, today, ink-portal as the first host. This portal is the public documentation site. Pink `#EA0A8E` is the only accent on docs chrome. Body text, borders, and canvases stay neutral.',
          'The marketing page at `/` is different: it uses the full brand gradient blue `#2951C4` → violet `#8A3FD4` → pink `#EA0A8E` and the three nested arcs logo.',
        ],
        callout: 'Pack levels are a page a CMS developer can add later. They are not part of first installment and they are not a permission shortcut.',
      },
    ],
    undefined,
    { slug: 'how-to-use', title: 'How to use' },
  ),
  'how-to-use': page(
    'how-to-use',
    'How to use',
    'A working map of Bifrost day to day: editors on Stage, engineers on the API, admins on agents, and Cursor on MCP.',
    'Docs / Getting started / How to use',
    [
      {
        id: 'editors',
        heading: 'Editors',
        paragraphs: [
          'Open the admin, pick a collection (pages, posts, or a custom cast). Stage is the canvas: sections, grids, and widgets. Drafts stay drafts until you publish. Media uploads go through the signed server route — the browser never posts files straight to the media cloud.',
          'Crew is in-app chat and tasks so a draft owner is a person in Bifrost, not a thread somewhere else. AI assist suggests type, spacing, and structure. Accept, tweak, or ignore. Nothing auto-applies.',
        ],
      },
      {
        id: 'engineers',
        heading: 'Engineers',
        paragraphs: [
          'Install locally or point at Cloud. The contract is the same. Query with the SDK or hit REST. Open `/api` on this portal for the API Explorer grid, then Export Postman collection for the whole surface.',
          'Do not invent a second content pipeline. If it is in the model, it is on the API after save.',
        ],
        code: {
          lang: 'ts',
          source: `import { bifrost } from '@forgedevstack/bifrost-sdk';

const posts = await bifrost
  .collection('posts')
  .filter({ status: 'published' })
  .sort('-publishedAt')
  .limit(10)
  .find();`,
        },
      },
      {
        id: 'admins',
        heading: 'Admins',
        paragraphs: [
          'Create user creates an agent. The permission screen is a toggle grid: rows are resources, columns are actions (read, write, publish, manage). All-on is the admin that can read every agent log.',
          'Default logs are scoped to the signed-in agent. Full permission set sees every trail. Pack levels are not offered on this screen at first install.',
        ],
      },
      {
        id: 'agents-cursor',
        heading: 'Agents and Cursor',
        paragraphs: [
          'Point Cursor MCP at `@forgedevstack/bifrost-mcp` (or `packages/mcp` in the monorepo). Ask AI on this site answers from the bundled docs index until you add `OPENAI_API_KEY` locally. Never commit tokens.',
        ],
        callout: 'Demo at `/demo` is a public walkthrough of chrome. The live admin is a separate app after installment.',
      },
    ],
    { slug: 'overview', title: 'Overview' },
    { slug: 'installation', title: 'Installation' },
  ),
  installation: page(
    'installation',
    'Installation',
    'Scaffold a Bifrost project locally or point installment at Cloud. Node 20+ and a package manager are required.',
    'Docs / Getting started / Installation',
    [
      {
        id: 'cli',
        heading: 'Install the CLI',
        paragraphs: [
          'The CLI writes the Nest API, copies the CMS host, and optionally clones a plugin repo. Pack levels are skipped on first install. Use the scoped package — not a short alias.',
        ],
        code: { lang: 'bash', source: 'npx @forgedevstack/bifrost-cli install' },
        callout: 'Requirements: Node 20+ and npm 10+. Check the generated `package.json` before you commit.',
      },
      {
        id: 'env',
        heading: 'Environment',
        paragraphs: [
          'Local APIs default to Nest on port 4100 and the Fastify CMS API on 4000. This docs portal is a Vite app (often 5173 or 5174). Postgres is required for the CMS. Put `DATABASE_URL` in `.env.local` on the API host, never in git.',
        ],
        table: {
          headers: ['Variable', 'Where', 'Purpose'],
          rows: [
            ['DATABASE_URL', 'API', 'Postgres connection. Local file only.'],
            ['INK_API_URL', 'server', 'CMS API base'],
            ['VITE_BIFROST_API_URL', 'admin / portal', 'Nest base for version and CMS routes'],
            ['VITE_CMS_API_URL', 'portal', 'Fastify CMS API if you split hosts'],
            ['OPENAI_API_KEY', 'Ask AI', 'Optional. You add this locally.'],
            ['FIGMA_ACCESS_TOKEN', 'local MCP', 'Optional design tokens. Never in the repo.'],
          ],
        },
      },
      {
        id: 'verify',
        heading: 'Verify',
        paragraphs: [
          'After install, `GET /api/v1/version` should return the sprint version. The admin binds `window.version` to that route. This portal shows `v1.0.0` in the docs pill until you host it as CMS content.',
        ],
      },
    ],
    { slug: 'how-to-use', title: 'How to use' },
    { slug: 'installment', title: 'Installment' },
  ),
  installment: page(
    'installment',
    'Installment',
    'Installment is the wizard. It is not `npm install` of a library — it creates the backend, copies the admin, and optionally wires a plugin git URL.',
    'Docs / Getting started / Installment',
    [
      {
        id: 'wizard',
        heading: 'What the wizard does',
        paragraphs: [
          '`npx @forgedevstack/bifrost-cli install` (or `bc install`) writes `apps/server` / `apps/cms-api` with Nest, routes, controllers, services, and middleware. The React CMS host is copied next to it. Checkbox Extend API keeps that tree editable so you can add modules without forking the package.',
          'Optional git URL clones a plugin or theme repo and installs it. That is how Store extensions land on day one — still not pack levels.',
        ],
        table: {
          headers: ['Step', 'You choose', 'What is written'],
          rows: [
            ['Host', 'Local Node or Cloud project', 'API origin and env stubs'],
            ['Database', 'Postgres URL', '`DATABASE_URL` in a local env file'],
            ['Extend API', 'On / off', 'Editable Nest tree vs locked package'],
            ['Plugin git URL', 'Optional', 'Cloned repo + register() hook'],
            ['Pack levels', 'Not asked', 'Developer page later if you need named packs'],
          ],
        },
      },
      {
        id: 'first-install',
        heading: 'First install vs later',
        paragraphs: [
          'First installment creates agents only through Create user. Permissions start as an empty toggle grid. There is no pack picker, no bronze/silver/gold, no default role bundle besides the empty grid and the all-on admin you toggle yourself.',
          'If a project later needs named packs, a CMS developer adds that page. It is not a hidden flag in the wizard.',
        ],
        callout: 'If the wizard offered pack levels, that would be a bug. Close the step and file it against the CLI, not against this docs site.',
      },
      {
        id: 'after',
        heading: 'After the wizard',
        paragraphs: [
          'Start the API, start the admin, then optionally this docs portal. Point `VITE_BIFROST_API_URL` at the origin you just created. Cloud and local share collection routes so the API Explorer and Postman export keep working when you move hosts.',
        ],
        code: {
          lang: 'bash',
          source: `cd bifrost && npm install && npm run dev
cd bifrost-portal && npm install && npm run dev`,
        },
      },
    ],
    { slug: 'installation', title: 'Installation' },
    { slug: 'quickstart', title: 'Quickstart' },
  ),
  quickstart: page(
    'quickstart',
    'Quickstart',
    'From empty folder to admin, API, and public docs in a few minutes.',
    'Docs / Getting started / Quickstart',
    [
      {
        id: 'steps',
        heading: 'Run the stack',
        paragraphs: [
          'Install, start the API, start the CMS host, then start this docs portal. Confirm `GET /api/v1/version` before you open Stage.',
        ],
        code: {
          lang: 'bash',
          source: `npx @forgedevstack/bifrost-cli install
cd bifrost && npm install && npm run dev
# admin: typically :5173
# nest: :4100  cms-api: :4000
cd ../bifrost-portal && npm install && npm run dev`,
        },
      },
      {
        id: 'first-content',
        heading: 'First content',
        paragraphs: [
          'Create an admin user (that user is an agent). Toggle the permission grid all-on for yourself. Open a collection, add a draft, publish. Hit the same record from the API Explorer or the SDK snippet on the landing page.',
        ],
      },
      {
        id: 'cursor',
        heading: 'Connect Cursor',
        paragraphs: [
          'Add the Bifrost MCP server (see MCP). Ask a question on `/ai` that quotes installment or collections — the stub answers from this docs index until OpenAI is configured locally.',
        ],
      },
    ],
    { slug: 'installment', title: 'Installment' },
    { slug: 'cloud-or-local', title: 'Cloud or local' },
  ),
  'cloud-or-local': page(
    'cloud-or-local',
    'Cloud or local',
    'Installment can target a local Node host or a Cloud project. The API contract stays the same so the SDK, Explorer, and Postman export do not change.',
    'Docs / Getting started / Cloud or local',
    [
      {
        id: 'local',
        heading: 'Local',
        paragraphs: [
          'Local installment writes `apps/server` (or `cms-api`), copies the React CMS host, and uses your Postgres. Good for development, CI, and air-gapped work.',
          'Put `DATABASE_URL` in `.env.local`. Neon, RDS, or a laptop Postgres all work. The Vite portal never reads that URL in the browser — only the API process does.',
        ],
        table: {
          headers: ['Piece', 'Typical local'],
          rows: [
            ['Admin', 'Vite, Bear chrome'],
            ['Nest / CMS API', ':4100 / :4000'],
            ['Postgres', '`DATABASE_URL` on the API'],
            ['Docs portal', 'This repo, often :5173 / :5174'],
            ['MCP', 'stdio from `packages/mcp`'],
          ],
        },
      },
      {
        id: 'cloud',
        heading: 'Cloud',
        paragraphs: [
          'Cloud installment links a remote project, deploys the API, and keeps the same collection routes. Point `VITE_BIFROST_API_URL` at the Cloud origin. Secrets stay in the Cloud secret store, not in this repo.',
        ],
        callout: 'Choose Cloud or local at installment. You can move later; collections and agent records travel with the database dump.',
      },
      {
        id: 'same-api',
        heading: 'Same API either way',
        paragraphs: [
          'REST paths, Postman export, and SDK calls do not branch on host. If a client works against local, it works against Cloud after you change the base URL.',
        ],
      },
    ],
    { slug: 'quickstart', title: 'Quickstart' },
    { slug: 'upgrade', title: 'Upgrade' },
  ),
  collections: page(
    'collections',
    'Collections',
    'Content lives in collections. Each collection is listable, creatable, filterable, and exportable to Postman from the API Explorer.',
    'Docs / Core concepts / Collections',
    [
      {
        id: 'shape',
        heading: 'Shape',
        paragraphs: [
          'A collection has fields (cast), locales, draft/publish, and media. The REST surface is `/api/cms/content` with filters per collection key. Stage writes the same records the SDK reads.',
        ],
      },
      {
        id: 'workflow',
        heading: 'Draft and publish',
        paragraphs: [
          'Saving a draft does not hide the record from authorized agents who can read drafts. Public clients should filter `status: published`. The Explorer lets you try both.',
        ],
        table: {
          headers: ['Action', 'Who', 'API'],
          rows: [
            ['List', 'read', 'GET /api/cms/content?collection='],
            ['Create', 'write', 'POST /api/cms/content'],
            ['Update', 'write', 'PATCH /api/cms/content/:id'],
            ['Publish', 'publish', 'status field on the record'],
            ['Media', 'write', 'Signed upload on the API, not the browser'],
          ],
        },
      },
    ],
    { slug: 'audit', title: 'Audit logs' },
    { slug: 'agents', title: 'Agents' },
  ),
  agents: page(
    'agents',
    'Agents',
    'Every user is an agent. Create user creates an agent. There is no second “bot” object on first install.',
    'Docs / Core concepts / Agents',
    [
      {
        id: 'create',
        heading: 'Create user = create agent',
        paragraphs: [
          'The admin Create user flow writes the agent record, credentials, and an empty permission grid. You then toggle cells. Cursor and MCP authenticate as an agent too — same grid.',
        ],
      },
      {
        id: 'identity',
        heading: 'Identity',
        paragraphs: [
          'Display name, email, and agent id show on Crew, tasks, and logs. Do not invent a parallel staff table. If someone can sign in, they are an agent.',
        ],
        callout: 'Pack levels do not mint agents. If you add packs later, they only group toggles — they still create users the same way.',
      },
    ],
    { slug: 'collections', title: 'Collections' },
    { slug: 'agent-logs', title: 'Agent logs' },
  ),
  'agent-logs': page(
    'agent-logs',
    'Agent logs',
    'Each agent sees their own trail by default. An admin with the full permission set sees every trail.',
    'Docs / Core concepts / Agent logs',
    [
      {
        id: 'scope',
        heading: 'Scope',
        paragraphs: [
          'Default: the signed-in agent only — publishes, edits, permission changes they made. Full permission set: all agents. That is the only “see everything” switch. There is no secret superuser flag besides the grid.',
        ],
        table: {
          headers: ['Viewer', 'Sees'],
          rows: [
            ['Agent with read on logs', 'Own events'],
            ['Agent with manage / all-on', 'Every agent'],
            ['MCP session', 'Same as the agent token it uses'],
          ],
        },
      },
      {
        id: 'sprint',
        heading: 'When the grid ships',
        paragraphs: [
          'The admin log grid is CMS sprint 1.1.9 work. This public site documents the contract so installment and MCP stay aligned before that screen lands.',
        ],
      },
    ],
    { slug: 'agents', title: 'Agents' },
    { slug: 'permissions', title: 'Permissions' },
  ),
  permissions: page(
    'permissions',
    'Permissions',
    'Permissions are a grid of toggles — rows are resources, columns are actions (read, write, publish, manage).',
    'Docs / Core concepts / Permissions',
    [
      {
        id: 'grid',
        heading: 'Toggle grid',
        paragraphs: [
          'Creating an agent opens an empty grid. Toggle cells to grant access. All-on is the admin role that can read every agent log. There is no dropdown of named packs on first install.',
        ],
        table: {
          headers: ['Column', 'Means'],
          rows: [
            ['read', 'List and get records'],
            ['write', 'Create and patch, including drafts'],
            ['publish', 'Change status to published'],
            ['manage', 'Agents, permissions, and all logs'],
          ],
        },
        callout: 'Pack levels are not a permission shortcut on first install. Developers add that page later if the project needs named packs.',
      },
      {
        id: 'mcp',
        heading: 'MCP and the grid',
        paragraphs: [
          'MCP tools run as the agent in the env file. If the grid denies publish, the tool cannot publish. Do not give Cursor an all-on token in a shared repo.',
        ],
      },
    ],
    { slug: 'agent-logs', title: 'Agent logs' },
    { slug: 'file-structure', title: 'File structure' },
  ),
  'file-structure': page(
    'file-structure',
    'File structure',
    'Bifrost is a monorepo. The public docs portal is a sibling app so it can later be installed as CMS content.',
    'Docs / Core concepts / File structure',
    [
      {
        id: 'tree',
        heading: 'After installment',
        paragraphs: ['Typical tree:'],
        code: {
          lang: 'text',
          source: `bifrost/
  apps/cms-fe/          React admin (Bear + Compass + Synapse)
  apps/cms-api/         Nest or Fastify CMS API
  apps/portal/          Install wizard chrome
  apps/website/         Marketing (optional)
  packages/core/        Types, permissions
  packages/api/         Route contracts + OpenAPI
  packages/sdk/         HTTP client (@forgedevstack/bifrost-sdk)
  packages/cli/         bifrost CLI
  packages/mcp/         MCP server
  packages/ui/          Install wizard tokens
bifrost-portal/         This public docs site (Vite)`,
        },
      },
      {
        id: 'portal',
        heading: 'This portal',
        paragraphs: [
          '`src/pages/Home` is the marketing landing at `/`. Docs, API Explorer, demo, Ask AI, and changelog use `DocShell`. Do not wrap `/` in DocShell — the landing is the product page.',
        ],
        table: {
          headers: ['Path', 'Surface'],
          rows: [
            ['/', 'Landing (gradient, arcs, Stage preview)'],
            ['/docs/:slug', 'DocShell + markdown-like pages'],
            ['/api', 'API Explorer + Postman export'],
            ['/demo', 'Public chrome walkthrough'],
            ['/ai', 'Ask AI (docs index until OpenAI key)'],
            ['/changelog', 'Portal sprint notes'],
          ],
        },
      },
      {
        id: 'conventions',
        heading: 'Conventions',
        paragraphs: [
          'Types in `*.types.ts`, constants in `*.const.ts`, no comments or JSDoc, `NUMBER_*` tokens, Bear for chrome, Compass for routes, Synapse for client state, Grid Table for the Explorer. User-facing copy through Lingo (`en` / `es`).',
        ],
      },
    ],
    { slug: 'permissions', title: 'Permissions' },
    { slug: 'plugins', title: 'Plugins' },
  ),
  plugins: page(
    'plugins',
    'Plugins',
    'A plugin is a git repo installment can clone. Extend the API, add admin screens, or register MCP tools. Store is the catalog of those repos — not a ceiling of allowed APIs.',
    'Docs / Guides / Plugins',
    [
      {
        id: 'install',
        heading: 'Install a plugin',
        paragraphs: [
          'Paste a git URL in the installment wizard, or add it later from Store. The CLI clones, installs, and calls `register()`. Version the plugin like any npm package. Searchable, one click, same API after save.',
        ],
      },
      {
        id: 'slots',
        heading: 'What a plugin may touch',
        paragraphs: [
          'Nest routes, admin slots (Stage widgets, Store cards), MCP tools, and collection fields. It must not write secrets into the portal repo. It must not turn on pack levels as a side effect of install.',
        ],
        table: {
          headers: ['Slot', 'Example'],
          rows: [
            ['API', '`ctx.routes.use(\'/api/plugin\', ctx.router)`'],
            ['Admin', 'A Bear screen registered on a nav key'],
            ['MCP', 'Extra tools on the same agent token'],
            ['Content', 'New collection or field on an existing cast'],
          ],
        },
      },
    ],
    { slug: 'file-structure', title: 'File structure' },
    { slug: 'create-plugin', title: 'Create a plugin' },
  ),
  'create-plugin': page(
    'create-plugin',
    'Create a plugin',
    'Start from a Bifrost plugin template, export `register()`, push a git URL, and hand that URL to installment.',
    'Docs / Guides / Create a plugin',
    [
      {
        id: 'scaffold',
        heading: 'Scaffold',
        paragraphs: [
          'Keep the same file rules as Bifrost: types in `*.types.ts`, constants in `*.const.ts`, barrel `index.ts`, no `any`, no comments. Peer-depend on the CMS host — do not bundle Bear twice.',
        ],
        code: {
          lang: 'text',
          source: `my-plugin/
  src/
    register.ts
    register.types.ts
    routes/
    admin/
    mcp/
  package.json
  README.md`,
        },
      },
      {
        id: 'register',
        heading: 'register()',
        paragraphs: [
          'Installment loads the default export or `register`. You receive the Nest app (or Fastify wrapper), router, and CMS host slots. Fail closed: if register throws, installment should roll back that plugin only.',
        ],
        code: {
          lang: 'ts',
          source: `import type { PluginContext } from '@forgedevstack/bifrost-core';

export function register(ctx: PluginContext) {
  ctx.routes.use('/api/plugin', ctx.router);
}`,
        },
      },
      {
        id: 'ship',
        heading: 'Ship',
        paragraphs: [
          'Push to git. In installment, paste the URL. In an already-running project, add the same URL in Store. Tag releases. Do not put `DATABASE_URL` or OpenAI keys in the plugin README.',
        ],
        callout: 'Creating a plugin does not create pack levels. Packs remain a separate developer page if the host app needs them.',
      },
    ],
    { slug: 'plugins', title: 'Plugins' },
    { slug: 'mcp', title: 'MCP' },
  ),
  mcp: page(
    'mcp',
    'MCP',
    'The Bifrost MCP server exposes collections, agents, and docs search to Cursor and other MCP clients. Ask AI on this site uses the same docs truth.',
    'Docs / Guides / MCP',
    [
      {
        id: 'why',
        heading: 'Why MCP',
        paragraphs: [
          'Agents should not scrape the admin. They should call the same collections, permissions, and docs index humans use. MCP is that socket. The portal Ask AI page is the browser-facing cousin: docs-grounded until you add OpenAI locally.',
        ],
      },
      {
        id: 'cursor',
        heading: 'Cursor',
        paragraphs: [
          'Point an MCP server at `packages/mcp` or the published `@forgedevstack/bifrost-mcp` package. Use env for API URL and the agent token. Do not put tokens in git or in this portal.',
        ],
        code: {
          lang: 'json',
          source: `{
  "mcpServers": {
    "bifrost": {
      "command": "npx",
      "args": ["-y", "@forgedevstack/bifrost-mcp"],
      "env": {
        "BIFROST_API_URL": "http://localhost:4100"
      }
    }
  }
}`,
        },
      },
      {
        id: 'tools',
        heading: 'Tools',
        paragraphs: [
          'Expect collection list/get, docs search, and agent-scoped logs. Tools inherit the permission grid of the token. Figma MCP is optional for design tokens — store `FIGMA_ACCESS_TOKEN` in local MCP config only.',
        ],
        callout: 'Rotate any token that was pasted in chat. The docs site never ships live secrets.',
      },
    ],
    { slug: 'create-plugin', title: 'Create a plugin' },
    { slug: 'figma-mcp', title: 'Figma MCP' },
  ),
  stack: page(
    'stack',
    'What we use',
    'ForgeStack libraries on the client, Nest or Fastify on the API, Bear for chrome, Postgres for content. Ink is the editor library — not a second CMS.',
    'Docs / Guides / What we use',
    [
      {
        id: 'libs',
        heading: 'Libraries',
        paragraphs: [
          'This docs portal is built with Bear, Compass, Synapse, and Grid Table. The CMS admin uses the same set plus Ink for editing. Installment is `@forgedevstack/bifrost-cli`. MCP is `@forgedevstack/bifrost-mcp`.',
        ],
        table: {
          headers: ['Package', 'Role'],
          rows: [
            ['@forgedevstack/bear', 'UI chrome'],
            ['@forgedevstack/forge-compass', 'Routing'],
            ['@forgedevstack/synapse', 'Client state'],
            ['@forgedevstack/grid-table', 'API Explorer grid'],
            ['@forgedevstack/ink', 'Editor inside the CMS'],
            ['@forgedevstack/lingo', 'i18n'],
            ['@forgedevstack/bifrost-cli', 'Installment'],
            ['@forgedevstack/bifrost-sdk', 'Typed client'],
            ['@forgedevstack/bifrost-mcp', 'MCP server'],
          ],
        },
      },
      {
        id: 'infra',
        heading: 'Infra',
        paragraphs: [
          'Postgres holds collections, agents, and logs. Neon is a valid host; the connection string stays in `.env.local`. Media uses signed uploads through the API. Optional OpenAI for Ask AI. Optional Cloudinary only behind the API.',
        ],
      },
    ],
    { slug: 'development', title: 'Development' },
    { slug: 'rest', title: 'REST API' },
  ),
  rest: page(
    'rest',
    'REST API',
    'Collection CRUD plus media, agents, permissions, and version. Use the API Explorer to try routes and export Postman.',
    'Docs / API reference / REST API',
    [
      {
        id: 'explorer',
        heading: 'API Explorer and Postman',
        paragraphs: [
          'Open `/api` on this portal. The grid lists method, path, collection, and summary. Export Postman collection downloads a v2.1 collection named Bifrost CMS API so the whole surface travels with you.',
          'Point Postman at local `:4100` or your Cloud origin. The same file works for both.',
        ],
      },
      {
        id: 'auth',
        heading: 'Auth',
        paragraphs: [
          'Admin tokens and session cookies both work. Prefer server-signed media upload. The browser must not post to the media cloud directly.',
        ],
      },
      {
        id: 'version',
        heading: 'Version',
        paragraphs: [
          '`GET /api/v1/version` is the handshake. Admin chrome and this portal should not invent a second version channel.',
        ],
        table: {
          headers: ['Area', 'Base'],
          rows: [
            ['Collections', '/api/cms/content'],
            ['Media', '/api/cms/media (signed)'],
            ['Agents', '/api/cms/users'],
            ['Version', '/api/v1/version'],
          ],
        },
        callout: 'Explorer data is the catalog. If a route is missing from the grid, add it in `src/constants/api.const.ts` on this portal.',
      },
    ],
    { slug: 'stack', title: 'What we use' },
    { slug: 'graphql', title: 'Query layer' },
  ),
  upgrade: page(
    'upgrade',
    'Upgrade',
    'Move a Bifrost project from one sprint to the next without a second content pipeline. Keep collections, agents, and the REST contract.',
    'Docs / Getting started / Upgrade',
    [
      {
        id: 'when',
        heading: 'When to upgrade',
        paragraphs: [
          'Upgrade when a sprint ships on `main` and you want that API, admin, or portal. Portal 1.0.0 is this docs site. CMS admin sprints (1.1.8 and after) land in the Bifrost monorepo. Do not mix those version numbers in chrome.',
        ],
      },
      {
        id: 'steps',
        heading: 'How to upgrade',
        paragraphs: [
          'Pull the sprint branch or tagged packages, run installment only if the wizard gained a step, then `npm install` and start the API. Confirm `GET /api/v1/version` before editors open Stage.',
          'Postgres migrations run with the API. Back up `DATABASE_URL` data first. Media stays on the signed upload path — no browser re-upload.',
        ],
        code: {
          lang: 'bash',
          source: `git fetch origin
git checkout main
npm install
npm run dev
curl -s http://localhost:4100/api/v1/version`,
        },
        callout: 'Secrets stay in `.env.local`. Never copy tokens from chat into the upgraded repo.',
      },
    ],
    { slug: 'cloud-or-local', title: 'Cloud or local' },
    { slug: 'admin', title: 'Admin panel' },
  ),
  admin: page(
    'admin',
    'Admin panel',
    'The admin is the CMS host: Bear chrome, Compass routes, Synapse state. This public docs portal is a sibling app, not the dashboard.',
    'Docs / Features / Admin panel',
    [
      {
        id: 'what',
        heading: 'What lives in admin',
        paragraphs: [
          'Stage, collections, media, agents, permissions, Crew, Store, and Ask AI for editors. The admin talks to Nest (or the Fastify CMS API) with the same REST the SDK uses.',
        ],
        table: {
          headers: ['Surface', 'Who', 'Not this'],
          rows: [
            ['Admin', 'Editors, admins, engineers debugging content', 'Public docs at this portal'],
            ['Docs portal', 'Anyone reading installment and APIs', 'Publishing drafts'],
            ['API Explorer', 'Engineers trying routes', 'Writing content'],
          ],
        },
      },
      {
        id: 'host',
        heading: 'First host',
        paragraphs: [
          'Ink portal is the first CMS host today. Bifrost `apps/cms-fe` is the long-term admin. Both use Bear. Pink is the only accent on docs; admin chrome can use the full brand where the product needs it.',
        ],
      },
    ],
    { slug: 'upgrade', title: 'Upgrade' },
    { slug: 'stage', title: 'Stage' },
  ),
  stage: page(
    'stage',
    'Stage',
    'Stage is the canvas: sections, grids, and widgets. Editors build pages here. Engineers still query the same collection records over REST.',
    'Docs / Features / Stage',
    [
      {
        id: 'canvas',
        heading: 'Canvas',
        paragraphs: [
          'Drag sections onto the page. Grids nest widgets. The inspector shows type, spacing, and AI suggestions. Accept, tweak, or ignore — nothing auto-applies.',
          'Saving Stage writes the collection. There is no separate “export to API” step.',
        ],
      },
      {
        id: 'ai',
        heading: 'AI on the canvas',
        paragraphs: [
          'Suggestions appear inline while you edit. They do not publish, rename collections, or change permissions. Crew stays the place to ask who owns a draft.',
        ],
      },
    ],
    { slug: 'admin', title: 'Admin panel' },
    { slug: 'draft-publish', title: 'Draft and publish' },
  ),
  'draft-publish': page(
    'draft-publish',
    'Draft and publish',
    'Every collection entry has a status. Drafts stay in the API for agents who can read them. Public clients should filter published.',
    'Docs / Features / Draft and publish',
    [
      {
        id: 'status',
        heading: 'Status',
        paragraphs: [
          'Save a draft without putting it on the public site. Publish flips status. Unpublish returns it to draft. The permission column `publish` is the only gate.',
        ],
        table: {
          headers: ['Status', 'Editors', 'Public SDK filter'],
          rows: [
            ['draft', 'Visible with write/read', 'Omit or filter out'],
            ['published', 'Visible', "`status: 'published'`"],
          ],
        },
      },
      {
        id: 'api',
        heading: 'API',
        paragraphs: [
          'PATCH the record and set status. Do not invent a second publish endpoint unless a plugin adds one. The Explorer lets you try both list filters.',
        ],
      },
    ],
    { slug: 'stage', title: 'Stage' },
    { slug: 'locales', title: 'Locales' },
  ),
  locales: page(
    'locales',
    'Locales',
    'Collections can store per-locale fields. Lingo is the library for UI copy on this portal and the admin. Content locales are data, not the same as the docs language switcher.',
    'Docs / Features / Locales',
    [
      {
        id: 'content',
        heading: 'Content locales',
        paragraphs: [
          'A page can have `en` and `es` bodies. The SDK filter accepts a locale. Missing locale falls back to the default you set on the collection — not to a guessed language.',
        ],
      },
      {
        id: 'lingo',
        heading: 'Lingo for chrome',
        paragraphs: [
          'This docs site uses `@forgedevstack/lingo` with local `en` / `es` catalogs. Do not add a custom i18n provider. Keys are dotted (`nav.docs`). Locale is stored under `bp-locale`.',
        ],
        callout: 'Content locale ≠ chrome locale. An editor can work in Spanish chrome on an English draft.',
      },
    ],
    { slug: 'draft-publish', title: 'Draft and publish' },
    { slug: 'media', title: 'Media' },
  ),
  media: page(
    'media',
    'Media',
    'Uploads go through a signed API route. The browser never posts files straight to the media cloud.',
    'Docs / Features / Media',
    [
      {
        id: 'signed',
        heading: 'Signed upload',
        paragraphs: [
          'The admin asks the API for a signed URL, then PUT the file. The API stores the asset record on the collection. Cloudinary or another store is optional and stays behind the API.',
        ],
        table: {
          headers: ['Step', 'Who'],
          rows: [
            ['Request sign', 'Admin → API'],
            ['PUT bytes', 'Browser → signed URL'],
            ['Save record', 'API → Postgres'],
          ],
        },
      },
      {
        id: 'docs',
        heading: 'Docs media',
        paragraphs: [
          'This portal can later host as CMS content. Until then, static files live in `public/`. Do not put secrets next to images.',
        ],
      },
    ],
    { slug: 'locales', title: 'Locales' },
    { slug: 'preview', title: 'Preview' },
  ),
  preview: page(
    'preview',
    'Preview',
    'Preview shows the page as it will render before you publish. Drafts preview with the editor session, not the public SDK filter.',
    'Docs / Features / Preview',
    [
      {
        id: 'draft',
        heading: 'Draft preview',
        paragraphs: [
          'Open preview from Stage. You see the draft with the same widgets the published page will use. A public token without draft read will not see this URL.',
        ],
      },
      {
        id: 'live',
        heading: 'Live vs demo',
        paragraphs: [
          '`/demo` on this portal is a public walkthrough of chrome. It is not a live preview of your Cloud project. After installment, preview lives in the admin.',
        ],
      },
    ],
    { slug: 'media', title: 'Media' },
    { slug: 'audit', title: 'Audit logs' },
  ),
  audit: page(
    'audit',
    'Audit logs',
    'Audit is the activity trail: who published, who changed permissions, who uploaded media. Agent logs are the per-agent view of the same contract.',
    'Docs / Features / Audit logs',
    [
      {
        id: 'trail',
        heading: 'What is recorded',
        paragraphs: [
          'Publish, unpublish, permission toggles, agent create, and signed media saves. Crew messages are not the audit trail.',
        ],
      },
      {
        id: 'who',
        heading: 'Who can read it',
        paragraphs: [
          'Default: your own events (see Agent logs). Full permission set: every agent. MCP sessions inherit the token’s grid. There is no secret superuser flag besides the grid.',
        ],
        callout: 'The admin audit grid ships with the CMS sprint. This page is the public contract so installment and MCP stay aligned.',
      },
    ],
    { slug: 'preview', title: 'Preview' },
    { slug: 'collections', title: 'Collections' },
  ),
  'figma-mcp': page(
    'figma-mcp',
    'Figma MCP',
    'Connect Figma’s MCP server so Cursor can read frames and tokens while you implement Bifrost chrome. Keep the Figma token local.',
    'Docs / Guides / Figma MCP',
    [
      {
        id: 'why',
        heading: 'Why Figma MCP',
        paragraphs: [
          'Design lives in Figma. The CMS and this docs portal live in git. Figma MCP lets the agent inspect a file or selection instead of guessing spacing from a screenshot.',
        ],
      },
      {
        id: 'cursor',
        heading: 'Cursor',
        paragraphs: [
          'Copy `.cursor/mcp.json.example` into your Cursor MCP settings. The official remote server is `https://mcp.figma.com/mcp`. Authenticate in Cursor. Do not commit a personal access token.',
          'If you use a local stdio bridge instead, put `FIGMA_ACCESS_TOKEN` in `.env.local` only. The example file in this repo has no secrets.',
        ],
        code: {
          lang: 'json',
          source: `{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}`,
        },
        callout: 'Bifrost MCP (`@forgedevstack/bifrost-mcp`) is a different server — collections and docs. You can run both. Never paste either token into chat or git.',
      },
      {
        id: 'desktop',
        heading: 'Figma desktop',
        paragraphs: [
          'Figma’s desktop app can expose Dev Mode MCP for the open file. Use that when you need the current selection. Remote MCP is enough for file URLs and tokens.',
        ],
      },
    ],
    { slug: 'mcp', title: 'MCP' },
    { slug: 'configuration', title: 'Configuration' },
  ),
  configuration: page(
    'configuration',
    'Configuration',
    'Env vars, Bear theme, Lingo locale, and Grid Table accent. Local files only for secrets.',
    'Docs / Guides / Configuration',
    [
      {
        id: 'env',
        heading: 'Environment',
        paragraphs: [
          'Copy `.env.example` to `.env.local`. The Vite portal only needs `VITE_BIFROST_API_URL` and optional `VITE_CMS_API_URL`. `DATABASE_URL` belongs on the API process. `OPENAI_API_KEY` and `FIGMA_ACCESS_TOKEN` stay local.',
        ],
        table: {
          headers: ['Variable', 'App', 'Commit?'],
          rows: [
            ['VITE_BIFROST_API_URL', 'portal / admin', 'Example only'],
            ['DATABASE_URL', 'API', 'Never'],
            ['OPENAI_API_KEY', 'Ask AI', 'Never'],
            ['FIGMA_ACCESS_TOKEN', 'Figma MCP', 'Never'],
          ],
        },
      },
      {
        id: 'theme',
        heading: 'Bear and Grid Table',
        paragraphs: [
          '`BearProvider` gets `bifrostTheme` (primary pink scale, neutrals, background, text, border) and `customVariants` (`bifrost`, `bifrostGhost`). Grid Table reads `--gt-accent-primary: #EA0A8E` from portal CSS so pagination and focus are pink, not the grid default blue.',
        ],
      },
      {
        id: 'lingo',
        heading: 'Lingo',
        paragraphs: [
          '`createLingo` in `src/i18n/portalLingo.ts` loads `en` and `es`. Wrap the tree in `LingoProvider`. Call `t("nav.docs")` — not a custom i18n hook.',
        ],
      },
    ],
    { slug: 'figma-mcp', title: 'Figma MCP' },
    { slug: 'development', title: 'Development' },
  ),
  development: page(
    'development',
    'Development',
    'How this portal is built: Vite, aliases, Bear, Compass, Synapse, Grid Table, Lingo, Anvil.',
    'Docs / Guides / Development',
    [
      {
        id: 'run',
        heading: 'Run locally',
        paragraphs: [
          '`npm install` then `npm run dev`. The app is often on 5173 or 5174. Path aliases: `@const`, `@pages`, `@components`, `@i18n`, `@config`, `@data`, `@utils`, `@store`. Do not use `../../` across folders.',
        ],
        code: {
          lang: 'bash',
          source: `cd bifrost-portal
npm install
npm run dev`,
        },
      },
      {
        id: 'anvil',
        heading: 'Anvil',
        paragraphs: [
          'Bear depends on `@forgedevstack/anvil` for `capitalize`, `titleCase`, and `sentenceCase`. Anvil’s main entry also exports Vue composables. This React portal stubs `vue` in Vite (`src/shims/vue.ts`) so the real Anvil package can load without a Vue app. Do not fake the whole Anvil package.',
        ],
      },
      {
        id: 'rules',
        heading: 'Rules',
        paragraphs: [
          'Types in `*.types.ts`, constants in `*.const.ts`, no comments or JSDoc, no `any`, `NUMBER_*` tokens, Bear `Typography` for headings, Lingo for copy. Ticket branches: `{feature|bug}/CMS-n` into `release/1.0.0`.',
        ],
      },
    ],
    { slug: 'configuration', title: 'Configuration' },
    { slug: 'stack', title: 'What we use' },
  ),
  graphql: page(
    'graphql',
    'Query layer',
    'Sprint 1.0.0 ships REST and the TypeScript SDK. A GraphQL endpoint is not on this portal yet — do not fake one in the Explorer.',
    'Docs / API reference / Query layer',
    [
      {
        id: 'rest-first',
        heading: 'REST first',
        paragraphs: [
          'Every collection is on REST the moment you save. Use `@forgedevstack/bifrost-sdk` or the API Explorer. Postman export covers the same surface.',
        ],
        code: {
          lang: 'ts',
          source: `import { bifrost } from '@forgedevstack/bifrost-sdk';

const posts = await bifrost
  .collection('posts')
  .filter({ status: 'published' })
  .find();`,
        },
      },
      {
        id: 'later',
        heading: 'If you need a query language later',
        paragraphs: [
          'A plugin or a later sprint can add a query endpoint. Until it is in `src/constants/api.const.ts` and in the Explorer grid, it is not part of the public contract.',
        ],
        callout: 'Ask AI and MCP should describe REST + SDK for 1.0.0. Do not document a GraphQL schema that does not exist.',
      },
    ],
    { slug: 'rest', title: 'REST API' },
    undefined,
  ),
};

export const DOC_SLUGS = Object.keys(DOC_PAGES);

export const searchDocs = (query: string): { slug: string; title: string }[] => {
  const q = query.trim().toLowerCase();
  if (!q) return DOC_SLUGS.map((slug) => ({ slug, title: DOC_PAGES[slug].title }));
  return DOC_SLUGS.filter((slug) => {
    const doc = DOC_PAGES[slug];
    const hay = [doc.title, doc.lead, doc.sections.map((s) => s.heading + s.paragraphs.join(' ')).join(' ')].join(' ').toLowerCase();
    return hay.includes(q);
  }).map((slug) => ({ slug, title: DOC_PAGES[slug].title }));
};
