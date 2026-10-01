import { NUMBER_ZERO, NUMBER_NINETEEN } from '@const/numbers.const';
import { ISO_DATE_SEP } from '@const/strings.const';
import type { AuditLogRecord } from '@sdk/modules/audit';
import type { VersionInfo } from '@sdk/modules/version';
import {
  DEVELOPER_BUILD_SEP,
  DEVELOPER_DOCKER_SEP,
  DEVELOPER_ROW_IDS,
  DEVELOPER_SECONDS_PER_HOUR,
  DEVELOPER_SECONDS_PER_MINUTE,
  DEVELOPER_SPACE,
} from './DeveloperPages.const';
import type { DeveloperAuditRow, DeveloperRow, DeveloperRowId, DeveloperRowLabels } from './DeveloperPages.types';

export const splitUptime = (uptimeSec: number): { hours: number; minutes: number } => {
  const safe = uptimeSec > NUMBER_ZERO ? uptimeSec : NUMBER_ZERO;
  const hours = Math.floor(safe / DEVELOPER_SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (safe % DEVELOPER_SECONDS_PER_HOUR) / DEVELOPER_SECONDS_PER_MINUTE,
  );
  return { hours, minutes };
};

export const displayValue = (value: string, emptyLabel: string): string => {
  if (!value) {
    return emptyLabel;
  }
  return value;
};

const dockerValue = (info: VersionInfo, emptyLabel: string): string => {
  if (!info.docker.running) {
    return emptyLabel;
  }
  const parts = [info.docker.hostname, info.docker.image, info.docker.containerName].filter(
    (part) => part,
  );
  if (parts.length === NUMBER_ZERO) {
    return emptyLabel;
  }
  return parts.join(DEVELOPER_DOCKER_SEP);
};

const buildValue = (info: VersionInfo, emptyLabel: string): string => {
  const parts = [info.build.sha, info.build.time, info.build.number].filter((part) => part);
  if (parts.length === NUMBER_ZERO) {
    return emptyLabel;
  }
  return parts.join(DEVELOPER_BUILD_SEP);
};

const platformValue = (info: VersionInfo, emptyLabel: string): string => {
  const parts = [info.platform, info.arch].filter((part) => part);
  if (parts.length === NUMBER_ZERO) {
    return emptyLabel;
  }
  return parts.join(DEVELOPER_SPACE);
};

export const buildDeveloperRows = (params: {
  info: VersionInfo;
  labels: DeveloperRowLabels;
  emptyLabel: string;
  uptimeText: string;
}): DeveloperRow[] => {
  const { info, labels, emptyLabel, uptimeText } = params;
  const values: Record<DeveloperRowId, string> = {
    product: displayValue(info.product, emptyLabel),
    version: displayValue(info.version, emptyLabel),
    portal: displayValue(info.portal, emptyLabel),
    node: displayValue(info.node, emptyLabel),
    platform: platformValue(info, emptyLabel),
    env: displayValue(info.env, emptyLabel),
    uptime: uptimeText,
    docker: dockerValue(info, emptyLabel),
    build: buildValue(info, emptyLabel),
  };
  return DEVELOPER_ROW_IDS.map((id) => ({
    id,
    label: labels[id],
    value: values[id],
  }));
};

export const formatAuditAt = (value: string): string =>
  value.slice(NUMBER_ZERO, NUMBER_NINETEEN).replace(ISO_DATE_SEP, DEVELOPER_SPACE);

const auditDetail = (metadata: Record<string, unknown>, emptyLabel: string): string => {
  const images = metadata.images;
  if (Array.isArray(images) && images.length > NUMBER_ZERO) {
    return String(images[NUMBER_ZERO]);
  }
  const title = metadata.title;
  if (typeof title === 'string' && title) {
    return title;
  }
  const fileName = metadata.fileName;
  if (typeof fileName === 'string' && fileName) {
    return fileName;
  }
  return emptyLabel;
};

export const mapAuditRows = (
  items: AuditLogRecord[],
  emptyLabel: string,
): DeveloperAuditRow[] =>
  items.map((item) => ({
    id: item.id,
    action: item.action,
    resource: item.resource || emptyLabel,
    detail: auditDetail(item.metadata, emptyLabel),
    userId: item.userId || emptyLabel,
    ipAddress: item.ipAddress || emptyLabel,
    createdAt: formatAuditAt(item.createdAt),
  }));

export const generatePostmanCollection = (): object => ({
  info: {
    name: 'Anchor Headless CMS API',
    _postman_id: 'bifrost-anchor-cms-collection',
    description: 'Complete Postman collection for Anchor / Bifrost Headless CMS REST API',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [
    {
      name: 'Articles',
      item: [
        {
          name: 'List Articles (Dedicated)',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/articles?locale=en&status=published',
              host: ['{{baseUrl}}'],
              path: ['api', 'articles'],
              query: [
                { key: 'locale', value: 'en' },
                { key: 'status', value: 'published' },
              ],
            },
          },
        },
        {
          name: 'Get Article by Slug (Dedicated)',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/articles/:slug',
              host: ['{{baseUrl}}'],
              path: ['api', 'articles', ':slug'],
              variable: [{ key: 'slug', value: 'getting-started-graphql' }],
            },
          },
        },
        {
          name: 'List Articles (CMS Generic)',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/cms/content/article?locale=en&status=published',
              host: ['{{baseUrl}}'],
              path: ['api', 'cms', 'content', 'article'],
              query: [
                { key: 'locale', value: 'en' },
                { key: 'status', value: 'published' },
              ],
            },
          },
        },
        {
          name: 'Get Article by ID',
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/cms/content/article/:id',
              host: ['{{baseUrl}}'],
              path: ['api', 'cms', 'content', 'article', ':id'],
              variable: [{ key: 'id', value: '1' }],
            },
          },
        },
        {
          name: 'Create Article',
          request: {
            method: 'POST',
            header: [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer {{token}}' },
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify(
                {
                  collection: 'article',
                  slug: 'getting-started-with-graphql',
                  title: 'Getting started with GraphQL',
                  locale: 'en',
                  status: 'published',
                  payload: { lead: 'Introduction to GraphQL APIs' },
                },
                null,
                2,
              ),
            },
            url: {
              raw: '{{baseUrl}}/api/cms/content',
              host: ['{{baseUrl}}'],
              path: ['api', 'cms', 'content'],
            },
          },
        },
        {
          name: 'Delete Article',
          request: {
            method: 'DELETE',
            header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
            url: {
              raw: '{{baseUrl}}/api/cms/content?id=1',
              host: ['{{baseUrl}}'],
              path: ['api', 'cms', 'content'],
              query: [{ key: 'id', value: '1' }],
            },
          },
        },
      ],
    },
    {
      name: 'Pages',
      item: [
        {
          name: 'List Published Pages',
          request: {
            method: 'GET',
            url: {
              raw: '{{baseUrl}}/api/pages',
              host: ['{{baseUrl}}'],
              path: ['api', 'pages'],
            },
          },
        },
        {
          name: 'Get Public Page by Slug',
          request: {
            method: 'GET',
            url: {
              raw: '{{baseUrl}}/api/public/pages/:slug',
              host: ['{{baseUrl}}'],
              path: ['api', 'public', 'pages', ':slug'],
              variable: [{ key: 'slug', value: 'pricing' }],
            },
          },
        },
      ],
    },
    {
      name: 'Blog',
      item: [
        {
          name: 'List Blog Posts',
          request: {
            method: 'GET',
            url: {
              raw: '{{baseUrl}}/api/blog/posts',
              host: ['{{baseUrl}}'],
              path: ['api', 'blog', 'posts'],
            },
          },
        },
        {
          name: 'Get Blog Post by Slug',
          request: {
            method: 'GET',
            url: {
              raw: '{{baseUrl}}/api/blog/posts/:slug',
              host: ['{{baseUrl}}'],
              path: ['api', 'blog', 'posts', ':slug'],
              variable: [{ key: 'slug', value: 'q4-launch-checklist' }],
            },
          },
        },
      ],
    },
    {
      name: 'System & Health',
      item: [
        {
          name: 'Health Check',
          request: {
            method: 'GET',
            url: {
              raw: '{{baseUrl}}/api/health',
              host: ['{{baseUrl}}'],
              path: ['api', 'health'],
            },
          },
        },
        {
          name: 'API Version',
          request: {
            method: 'GET',
            url: {
              raw: '{{baseUrl}}/api/v1/version',
              host: ['{{baseUrl}}'],
              path: ['api', 'v1', 'version'],
            },
          },
        },
      ],
    },
  ],
  variable: [
    { key: 'baseUrl', value: 'http://localhost:4000' },
    { key: 'token', value: 'YOUR_API_TOKEN' },
  ],
});

export const downloadPostmanCollection = (): void => {
  const collection = generatePostmanCollection();
  const blob = new Blob([JSON.stringify(collection, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'anchor-cms-postman-collection.json';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

