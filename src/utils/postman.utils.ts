import { API_ENDPOINTS } from '@const/api.const';
import { DEFAULT_API_BASE, POSTMAN_COLLECTION_NAME, POSTMAN_SCHEMA } from '@const/strings.const';

interface PostmanItem {
  name: string;
  request: {
    method: string;
    header: { key: string; value: string }[];
    url: { raw: string; host: string[]; path: string[] };
  };
}

interface PostmanCollection {
  info: { name: string; schema: string };
  item: { name: string; item: PostmanItem[] }[];
}

export const buildPostmanCollection = (baseUrl = DEFAULT_API_BASE): PostmanCollection => {
  const groups = new Map<string, PostmanItem[]>();
  API_ENDPOINTS.forEach((endpoint) => {
    const pathParts = endpoint.path.replace(/^\//, '').split('/');
    const item: PostmanItem = {
      name: `${endpoint.method} ${endpoint.path}`,
      request: {
        method: endpoint.method,
        header: [{ key: 'Accept', value: 'application/json' }],
        url: {
          raw: `${baseUrl}${endpoint.path}`,
          host: [baseUrl],
          path: pathParts,
        },
      },
    };
    const list = groups.get(endpoint.collection) ?? [];
    list.push(item);
    groups.set(endpoint.collection, list);
  });
  return {
    info: { name: POSTMAN_COLLECTION_NAME, schema: POSTMAN_SCHEMA },
    item: [...groups.entries()].map(([name, item]) => ({ name, item })),
  };
};

export const downloadPostmanCollection = (): void => {
  const blob = new Blob([JSON.stringify(buildPostmanCollection(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'bifrost-cms.postman_collection.json';
  anchor.click();
  URL.revokeObjectURL(url);
};
