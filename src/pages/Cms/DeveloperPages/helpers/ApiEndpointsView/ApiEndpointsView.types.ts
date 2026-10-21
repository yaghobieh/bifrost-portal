export type EndpointDef = {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: string;
  description: string;
  headers: Record<string, string>;
  requestBody?: Record<string, unknown> | null;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: Record<string, unknown>;
};
