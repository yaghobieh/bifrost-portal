export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  collection: string;
  summary: string;
  [key: string]: string;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  { id: 'version', method: 'GET', path: '/api/v1/version', collection: 'Runtime', summary: 'Runtime version payload bound to window.version' },
  { id: 'health', method: 'GET', path: '/api/health', collection: 'Runtime', summary: 'Process health check' },
  { id: 'status', method: 'GET', path: '/api/status', collection: 'Runtime', summary: 'Live service probes and incidents' },
  { id: 'content-list', method: 'GET', path: '/api/cms/content', collection: 'Content', summary: 'List content entries for a collection' },
  { id: 'content-get', method: 'GET', path: '/api/cms/content/:id', collection: 'Content', summary: 'Get one content entry' },
  { id: 'content-create', method: 'POST', path: '/api/cms/content', collection: 'Content', summary: 'Create a content entry' },
  { id: 'content-update', method: 'PUT', path: '/api/cms/content/:id', collection: 'Content', summary: 'Update a content entry' },
  { id: 'content-patch', method: 'PATCH', path: '/api/cms/content/:id', collection: 'Content', summary: 'Patch fields on a content entry' },
  { id: 'content-delete', method: 'DELETE', path: '/api/cms/content/:id', collection: 'Content', summary: 'Delete a content entry' },
  { id: 'media-list', method: 'GET', path: '/api/cms/media', collection: 'Media', summary: 'List media assets' },
  { id: 'media-upload', method: 'POST', path: '/api/cms/media/upload', collection: 'Media', summary: 'Upload via signed server endpoint' },
  { id: 'agents-list', method: 'GET', path: '/api/cms/agents', collection: 'Agents', summary: 'List agents (users)' },
  { id: 'agents-create', method: 'POST', path: '/api/cms/agents', collection: 'Agents', summary: 'Create an agent (create user)' },
  { id: 'agents-logs', method: 'GET', path: '/api/cms/agents/:id/logs', collection: 'Agents', summary: 'Agent activity trail (own or all)' },
  { id: 'permissions', method: 'GET', path: '/api/cms/permissions', collection: 'Permissions', summary: 'Permission grid for an agent' },
  { id: 'permissions-put', method: 'PUT', path: '/api/cms/permissions/:agentId', collection: 'Permissions', summary: 'Replace toggle grid for an agent' },
  { id: 'plugins-list', method: 'GET', path: '/api/cms/plugins', collection: 'Plugins', summary: 'Installed plugins from Store / git URLs' },
  { id: 'audit', method: 'GET', path: '/api/cms/audit', collection: 'Audit', summary: 'Admin-wide audit log' },
];

export const API_COLLECTIONS = [
  'Runtime',
  'Content',
  'Media',
  'Agents',
  'Permissions',
  'Plugins',
  'Audit',
] as const;
