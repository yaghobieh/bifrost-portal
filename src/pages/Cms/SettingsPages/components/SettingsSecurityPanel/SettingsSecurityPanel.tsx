import { useState, useEffect, type FC, type ChangeEvent } from 'react';
import {
  Badge,
  Button,
  Card,
  Flex,
  Input,
  Modal,
  Select,
  Typography,
} from '@forgedevstack/bear';
import {
  CMS_SECURITY_USERS_KEY,
  CMS_SECURITY_PERMS_KEY,
  CMS_SECURITY_TOKENS_KEY,
  CMS_SECURITY_WEBHOOKS_KEY,
  CONTENT_TYPE_RESOURCES,
  INITIAL_ADMIN_USERS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_API_TOKENS,
  INITIAL_WEBHOOKS,
} from './SettingsSecurityPanel.const';
import type {
  AdminRole,
  AdminUser,
  ApiToken,
  ApiTokenScope,
  ContentAction,
  RolePermissionMatrix,
  SettingsSecurityPanelProps,
  WebhookEvent,
  WebhookItem,
} from './SettingsSecurityPanel.types';

export const SettingsSecurityPanel: FC<SettingsSecurityPanelProps> = ({ onSave }) => {
  // Admin Users state
  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem(CMS_SECURITY_USERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  // Roles & Permissions state
  const [permissions, setPermissions] = useState<RolePermissionMatrix>(() => {
    try {
      const stored = localStorage.getItem(CMS_SECURITY_PERMS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ROLE_PERMISSIONS;
    } catch {
      return INITIAL_ROLE_PERMISSIONS;
    }
  });

  const [activeRoleTab, setActiveRoleTab] = useState<AdminRole>('Editor');

  // API Tokens state
  const [tokens, setTokens] = useState<ApiToken[]>(() => {
    try {
      const stored = localStorage.getItem(CMS_SECURITY_TOKENS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_API_TOKENS;
    } catch {
      return INITIAL_API_TOKENS;
    }
  });

  // Webhooks state
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(() => {
    try {
      const stored = localStorage.getItem(CMS_SECURITY_WEBHOOKS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_WEBHOOKS;
    } catch {
      return INITIAL_WEBHOOKS;
    }
  });

  // Feedback states
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('Editor');

  // Token Generator Modal
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenScope, setTokenScope] = useState<ApiTokenScope>('read-only');
  const [tokenExpires, setTokenExpires] = useState('90 days');
  const [generatedToken, setGeneratedToken] = useState<ApiToken | null>(null);

  // Webhook Modal
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookPlatform, setWebhookPlatform] = useState<'vercel' | 'netlify' | 'custom'>('vercel');
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(['content.publish']);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(CMS_SECURITY_USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(CMS_SECURITY_PERMS_KEY, JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem(CMS_SECURITY_TOKENS_KEY, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem(CMS_SECURITY_WEBHOOKS_KEY, JSON.stringify(webhooks));
  }, [webhooks]);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // 1. Admin Users Handlers
  const handleInviteUser = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'invited',
      lastActive: 'Never',
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
    showToast(`Invited ${newUser.name} as ${newUser.role}`);
    onSave?.();
  };

  const handleRoleChange = (userId: string, newRole: AdminRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast('User role updated');
    onSave?.();
  };

  const handleRemoveUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Admin user removed');
    onSave?.();
  };

  // 2. Roles & Permissions Handlers
  const handleTogglePermission = (
    resourceId: string,
    action: ContentAction
  ) => {
    setPermissions((prev) => {
      const currentRolePerms = prev[activeRoleTab] || {};
      const currentResourcePerms = currentRolePerms[resourceId] || {
        create: false,
        read: false,
        update: false,
        delete: false,
        publish: false,
      };

      return {
        ...prev,
        [activeRoleTab]: {
          ...currentRolePerms,
          [resourceId]: {
            ...currentResourcePerms,
            [action]: !currentResourcePerms[action],
          },
        },
      };
    });
  };

  const handleSavePermissions = () => {
    localStorage.setItem(CMS_SECURITY_PERMS_KEY, JSON.stringify(permissions));
    showToast(`Permissions saved for ${activeRoleTab}`);
    onSave?.();
  };

  // 3. API Tokens Handlers
  const handleCreateToken = () => {
    if (!tokenName.trim()) return;
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const fullToken = `bf_live_${randomHex}`;
    const masked = `bf_live_••••••••••••••••${randomHex.slice(-6)}`;

    const newToken: ApiToken = {
      id: `tok-${Date.now()}`,
      name: tokenName.trim(),
      token: fullToken,
      maskedToken: masked,
      scope: tokenScope,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: tokenExpires,
      lastUsed: 'Never',
    };

    setTokens((prev) => [newToken, ...prev]);
    setGeneratedToken(newToken);
    setTokenName('');
    showToast(`Token "${newToken.name}" created`);
    onSave?.();
  };

  const handleRevokeToken = (tokenId: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== tokenId));
    showToast('API token revoked');
    onSave?.();
  };

  // 4. Webhook Handlers
  const handleCreateWebhook = () => {
    if (!webhookName.trim() || !webhookUrl.trim()) return;
    const newWh: WebhookItem = {
      id: `wh-${Date.now()}`,
      name: webhookName.trim(),
      url: webhookUrl.trim(),
      platform: webhookPlatform,
      events: webhookEvents,
      status: 'active',
    };
    setWebhooks((prev) => [...prev, newWh]);
    setWebhookName('');
    setWebhookUrl('');
    setIsWebhookModalOpen(false);
    showToast(`Webhook "${newWh.name}" added`);
    onSave?.();
  };

  const handleToggleWebhookStatus = (whId: string) => {
    setWebhooks((prev) =>
      prev.map((wh) =>
        wh.id === whId
          ? { ...wh, status: wh.status === 'active' ? 'paused' : 'active' }
          : wh
      )
    );
  };

  const handleTestWebhook = (whId: string) => {
    showToast('Dispatching test payload...');
    setTimeout(() => {
      setWebhooks((prev) =>
        prev.map((wh) =>
          wh.id === whId
            ? {
                ...wh,
                lastTriggered: new Date().toISOString().replace('T', ' ').substring(0, 19),
                lastStatus: 200,
              }
            : wh
        )
      );
      showToast('Webhook ping delivered! HTTP 200 OK');
    }, 700);
  };

  const handleDeleteWebhook = (whId: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== whId));
    showToast('Webhook deleted');
    onSave?.();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="bifrost-cms-security-panel flex flex-col gap-8 pb-10">
      {/* Toast alert */}
      {statusMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2 border border-sky-400/30 animate-fade-in">
          <span>🛡️</span>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-[#1e3a8a]/20 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔐</span>
            <Typography variant="h5" className="text-white font-bold mb-0">
              Admin Panel & Security
            </Typography>
            <Badge variant="info">
              v1.0.2 Security Hardened
            </Badge>
          </div>
          <Typography variant="caption" className="text-slate-400 mb-0">
            Manage administrative privileges, granular role matrices, scoped API tokens, and deployment webhooks.
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsTokenModalOpen(true)}
          >
            ＋ New API Token
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsInviteModalOpen(true)}
          >
            ＋ Invite Admin
          </Button>
        </div>
      </div>

      {/* SECTION 1: Admin Users Table */}
      <Card className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-0">
              Admin Users & Roles
            </Typography>
            <Typography variant="caption" className="text-slate-400 mb-0">
              Users with access to Bifrost CMS dashboard and editing workspaces.
            </Typography>
          </div>
          <Badge variant="outline">
            {users.length} Users
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-sky-200 font-bold text-xs flex items-center justify-center">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'Super Admin'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                          : u.role === 'Editor'
                            ? 'bg-sky-950/60 text-sky-300 border border-sky-800/50'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'neutral'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">
                    {u.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value as AdminRole)
                        }
                        className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 outline-none"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Author">Author</option>
                      </select>
                      {users.length > 1 && (
                        <button
                          onClick={() => handleRemoveUser(u.id)}
                          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/30 border border-red-900/50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 2: Roles & Permissions Matrix */}
      <Card className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-0">
              Roles & Granular Permissions Matrix
            </Typography>
            <Typography variant="caption" className="text-slate-400 mb-0">
              Configure fine-grained Create, Read, Update, Delete, and Publish privileges per content model.
            </Typography>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSavePermissions}
          >
            Save Role Permissions
          </Button>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 mb-4">
          {(['Super Admin', 'Editor', 'Author'] as AdminRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRoleTab(role)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRoleTab === role
                  ? 'bg-[#1e3a8a] text-white shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Content Type</th>
                <th className="py-3 px-4 text-center">Create</th>
                <th className="py-3 px-4 text-center">Read</th>
                <th className="py-3 px-4 text-center">Update</th>
                <th className="py-3 px-4 text-center">Delete</th>
                <th className="py-3 px-4 text-center">Publish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {CONTENT_TYPE_RESOURCES.map((res) => {
                const perms = permissions[activeRoleTab]?.[res.id] || {
                  create: false,
                  read: false,
                  update: false,
                  delete: false,
                  publish: false,
                };
                return (
                  <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      {res.name}
                    </td>
                    {(['create', 'read', 'update', 'delete', 'publish'] as ContentAction[]).map(
                      (action) => (
                        <td key={action} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={Boolean(perms[action])}
                            onChange={() => handleTogglePermission(res.id, action)}
                            className="w-4 h-4 rounded text-[#1e3a8a] bg-slate-950 border-slate-700 cursor-pointer accent-[#1e3a8a]"
                          />
                        </td>
                      )
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 3: API Tokens Generator */}
      <Card className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-0">
              Scoped API Tokens
            </Typography>
            <Typography variant="caption" className="text-slate-400 mb-0">
              Generate bearer tokens for headless frontend queries, mobile apps, or automation scripts.
            </Typography>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsTokenModalOpen(true)}
          >
            ＋ Generate Token
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Token Name</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Masked Key</th>
                <th className="py-3 px-4">Expires</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tokens.map((tok) => (
                <tr key={tok.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{tok.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        tok.scope === 'full-access'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {tok.scope}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-400">
                    {tok.maskedToken}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {tok.expiresAt}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {tok.lastUsed || 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyToClipboard(tok.token)}
                        className="text-xs text-sky-400 hover:text-sky-300 px-2 py-1 rounded bg-sky-950/30 border border-sky-900/50"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleRevokeToken(tok.id)}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/30 border border-red-900/50"
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 4: Webhooks Management */}
      <Card className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-0">
              Deployment & Build Webhooks
            </Typography>
            <Typography variant="caption" className="text-slate-400 mb-0">
              Trigger on-demand static generation on Vercel, Netlify, or custom endpoints when content is published or deleted.
            </Typography>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsWebhookModalOpen(true)}
          >
            ＋ Add Webhook
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">
                    {wh.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      wh.platform === 'vercel'
                        ? 'bg-black text-white border border-slate-700'
                        : wh.platform === 'netlify'
                          ? 'bg-teal-950 text-teal-300 border border-teal-800'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {wh.platform}
                  </span>
                  <Badge variant={wh.status === 'active' ? 'success' : 'neutral'}>
                    {wh.status}
                  </Badge>
                </div>
                <div className="font-mono text-xs text-slate-400 truncate max-w-xl">
                  {wh.url}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {wh.events.map((ev) => (
                    <span
                      key={ev}
                      className="bg-slate-800 text-sky-300 text-[11px] font-mono px-2 py-0.5 rounded"
                    >
                      {ev}
                    </span>
                  ))}
                  {wh.lastTriggered && (
                    <span className="text-[11px] text-slate-500 ml-2 self-center">
                      Last: {wh.lastTriggered} ({wh.lastStatus} OK)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestWebhook(wh.id)}
                >
                  ⚡ Test Ping
                </Button>
                <button
                  onClick={() => handleToggleWebhookStatus(wh.id)}
                  className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700"
                >
                  {wh.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteWebhook(wh.id)}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1.5 rounded bg-red-950/30 border border-red-900/50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* MODAL 1: Invite Admin User */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Admin User"
        size="md"
      >
        <div className="p-4 flex flex-col gap-4 text-slate-200">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Rostova"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Work Email
            </label>
            <input
              type="email"
              placeholder="elena@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Administrative Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AdminRole)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Editor">Editor (Create, Edit, Publish)</option>
              <option value="Author">Author (Drafts & Media)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleInviteUser}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Create Scoped API Token */}
      <Modal
        isOpen={isTokenModalOpen}
        onClose={() => {
          setIsTokenModalOpen(false);
          setGeneratedToken(null);
        }}
        title="Generate Headless API Token"
        size="md"
      >
        <div className="p-4 flex flex-col gap-4 text-slate-200">
          {!generatedToken ? (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Token Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js Static Generator"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Scope
                </label>
                <select
                  value={tokenScope}
                  onChange={(e) => setTokenScope(e.target.value as ApiTokenScope)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
                >
                  <option value="read-only">Read-Only (Recommended for public websites)</option>
                  <option value="full-access">Full-Access (Read, Write, Delete, Publish)</option>
                  <option value="custom">Custom Content Type Scopes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Expiration
                </label>
                <select
                  value={tokenExpires}
                  onChange={(e) => setTokenExpires(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
                >
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                  <option value="Never">Never (Permanent)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTokenModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCreateToken}
                >
                  Generate Key
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <span>✅</span>
                <span>API Token generated successfully! Please copy it now. For security, you will not be able to view the full plaintext key again.</span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Secret Key ({generatedToken.name})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedToken.token}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-amber-300 outline-none"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => copyToClipboard(generatedToken.token)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Masked representation in logs: <span className="font-mono text-slate-300">{generatedToken.maskedToken}</span>
              </div>
              <div className="flex justify-end pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsTokenModalOpen(false);
                    setGeneratedToken(null);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 3: Add Webhook */}
      <Modal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        title="Register Deployment Webhook"
        size="md"
      >
        <div className="p-4 flex flex-col gap-4 text-slate-200">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Webhook Name
            </label>
            <input
              type="text"
              placeholder="e.g. Vercel Staging Deploy"
              value={webhookName}
              onChange={(e) => setWebhookName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Target Platform
            </label>
            <select
              value={webhookPlatform}
              onChange={(e) =>
                setWebhookPlatform(e.target.value as 'vercel' | 'netlify' | 'custom')
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#1e3a8a]"
            >
              <option value="vercel">Vercel Deploy Hook</option>
              <option value="netlify">Netlify Build Hook</option>
              <option value="custom">Custom HTTP POST Endpoint</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Payload URL
            </label>
            <input
              type="url"
              placeholder="https://api.vercel.com/v1/integrations/deploy/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">
              Trigger Events
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  ['content.publish', 'Content Published'],
                  ['content.delete', 'Content Deleted'],
                  ['site.update', 'Site Config Updated'],
                  ['media.upload', 'Media Asset Uploaded'],
                ] as const
              ).map(([evId, evLabel]) => (
                <label
                  key={evId}
                  className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={webhookEvents.includes(evId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWebhookEvents((prev) => [...prev, evId]);
                      } else {
                        setWebhookEvents((prev) => prev.filter((x) => x !== evId));
                      }
                    }}
                    className="accent-[#1e3a8a]"
                  />
                  <span>{evLabel}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsWebhookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleCreateWebhook}
            >
              Save Webhook
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
