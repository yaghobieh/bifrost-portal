export type AdminRole = 'Super Admin' | 'Editor' | 'Author';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'invited';
  lastActive: string;
  avatarUrl?: string;
};

export type ContentAction = 'create' | 'read' | 'update' | 'delete' | 'publish';

export type RolePermissionMatrix = Record<
  AdminRole,
  Record<string, Record<ContentAction, boolean>>
>;

export type ApiTokenScope = 'read-only' | 'full-access' | 'custom';

export type ApiToken = {
  id: string;
  name: string;
  token: string;
  maskedToken: string;
  scope: ApiTokenScope;
  customScopes?: string[];
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
};

export type WebhookEvent =
  | 'content.publish'
  | 'content.delete'
  | 'site.update'
  | 'media.upload';

export type WebhookItem = {
  id: string;
  name: string;
  url: string;
  platform: 'vercel' | 'netlify' | 'custom';
  events: WebhookEvent[];
  status: 'active' | 'paused';
  lastTriggered?: string;
  lastStatus?: number;
};

export type SettingsSecurityPanelProps = {
  onSave?: () => void;
};
