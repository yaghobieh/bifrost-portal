import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Card, Flex, Typography } from '@forgedevstack/bear';

export const EasyInstallView: FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const copyText = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadStarter = () => {
    setDownloading(true);
    // Simulate generating and downloading clean starter zip
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([
        `# Bifrost CMS Starter Package
# Version: 1.1.16
# Developed by ForgeStack

1. Run:
   npm install
2. Configure .env:
   DATABASE_URL=postgres://...
   CMS_SECRET=...
3. Start:
   npm run dev
`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'bifrost-cms-starter-v1.1.16.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info" className="bg-[var(--bear-primary-500,#1E3A8A)] text-white font-semibold text-xs px-2.5 py-0.5">
                Quick-Start &amp; Distribution
              </Badge>
              <Badge variant="outline" className="text-cyan-400 border-cyan-800 text-xs">
                v1.1.16 Stable
              </Badge>
            </div>
            <Typography variant="h2" className="text-2xl font-bold text-white mb-1">
              Easy Install Bifrost CMS
            </Typography>
            <Typography variant="body2" className="text-gray-300 max-w-2xl text-sm">
              Deploy Bifrost CMS in under 60 seconds via 1-click starter download, official Git clone, terminal CLI installer, or production Docker Compose.
            </Typography>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="primary"
              className="bg-[var(--bear-primary-500,#1E3A8A)] hover:bg-[var(--bear-primary-600,#172554)] text-white shadow-sm flex items-center gap-1.5"
              onClick={handleDownloadStarter}
              loading={downloading}
            >
              <BearIcons.DownloadIcon size={14} />
              <span>Download Starter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Installation Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Method 1: Git Clone (User requested) */}
        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  git
                </span>
                <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                  Method 1: Git Clone Repository
                </Typography>
              </div>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">
                Recommended for Devs
              </Badge>
            </div>
            <Typography variant="body2" className="text-xs text-gray-600 mb-3">
              Clone the complete monorepo including Bifrost Nest API, CMS Portal, dynamic page builder, and Bear design system.
            </Typography>

            <div className="bg-slate-950 p-3 rounded-lg text-cyan-300 font-mono text-xs overflow-x-auto relative mb-3">
              <code>git clone https://github.com/yaghobieh/bifrost.git &amp;&amp; cd bifrost &amp;&amp; npm install</code>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-900 border-blue-200 hover:bg-blue-50"
            onClick={() => copyText('git', 'git clone https://github.com/yaghobieh/bifrost.git && cd bifrost && npm install')}
          >
            {copiedId === 'git' ? (
              <>
                <BearIcons.CheckIcon size={13} className="text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied Command!</span>
              </>
            ) : (
              <>
                <BearIcons.CopyIcon size={13} />
                <span>Copy Git Clone Command</span>
              </>
            )}
          </Button>
        </Card>

        {/* Method 2: Direct Download Bundle */}
        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[var(--bear-primary-500,#1E3A8A)] text-white flex items-center justify-center font-bold text-xs">
                  ZIP
                </span>
                <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                  Method 2: Direct Starter Download
                </Typography>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50">
                1-Click
              </Badge>
            </div>
            <Typography variant="body2" className="text-xs text-gray-600 mb-3">
              Download the pre-bundled starter archive containing clean environment configurations, database seeds, and ready-to-run scripts.
            </Typography>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs text-gray-600 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BearIcons.FileTextIcon size={16} className="text-[var(--bear-primary-500,#1E3A8A)]" />
                <span className="font-semibold text-gray-800">bifrost-cms-starter-v1.1.16.tar.gz</span>
              </div>
              <span className="text-gray-400">12.4 MB</span>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            className="w-full bg-[var(--bear-primary-500,#1E3A8A)] hover:bg-[var(--bear-primary-600,#172554)] text-white flex items-center justify-center gap-1.5 text-xs shadow-sm"
            onClick={handleDownloadStarter}
            loading={downloading}
          >
            <BearIcons.DownloadIcon size={13} />
            <span>Download Starter Archive</span>
          </Button>
        </Card>

        {/* Method 3: CLI Installer */}
        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  CLI
                </span>
                <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                  Method 3: Bifrost CLI Installer
                </Typography>
              </div>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">
                @forgedevstack/bifrost-cli
              </Badge>
            </div>
            <Typography variant="body2" className="text-xs text-gray-600 mb-3">
              Scaffold new sites, create headless content models, and check deployment health interactively from your terminal.
            </Typography>

            <div className="bg-slate-950 p-3 rounded-lg text-cyan-300 font-mono text-xs overflow-x-auto relative mb-3">
              <code>npx @forgedevstack/bifrost-cli create my-site &amp;&amp; cd my-site &amp;&amp; bifrost install</code>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-900 border-blue-200 hover:bg-blue-50"
            onClick={() => copyText('cli', 'npx @forgedevstack/bifrost-cli create my-site && cd my-site && bifrost install')}
          >
            {copiedId === 'cli' ? (
              <>
                <BearIcons.CheckIcon size={13} className="text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied Command!</span>
              </>
            ) : (
              <>
                <BearIcons.CopyIcon size={13} />
                <span>Copy CLI Command</span>
              </>
            )}
          </Button>
        </Card>

        {/* Method 4: Docker Container */}
        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  🐳
                </span>
                <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                  Method 4: Docker Compose
                </Typography>
              </div>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">
                Production Ready
              </Badge>
            </div>
            <Typography variant="body2" className="text-xs text-gray-600 mb-3">
              Spin up PostgreSQL, Redis, Bifrost Nest API, and the React CMS portal on ports 3000 &amp; 4000 instantly.
            </Typography>

            <div className="bg-slate-950 p-3 rounded-lg text-cyan-300 font-mono text-xs overflow-x-auto relative mb-3">
              <code>docker run -d -p 3000:3000 -p 4000:4000 forgedevstack/bifrost:latest</code>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-900 border-blue-200 hover:bg-blue-50"
            onClick={() => copyText('docker', 'docker run -d -p 3000:3000 -p 4000:4000 forgedevstack/bifrost:latest')}
          >
            {copiedId === 'docker' ? (
              <>
                <BearIcons.CheckIcon size={13} className="text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied Command!</span>
              </>
            ) : (
              <>
                <BearIcons.CopyIcon size={13} />
                <span>Copy Docker Command</span>
              </>
            )}
          </Button>
        </Card>
      </div>

      {/* System Requirements Callout */}
      <Card variant="outlined" padding="md" className="bg-blue-50/50 border border-blue-200 rounded-xl">
        <Typography variant="h3" className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-2">
          Minimum System Requirements
        </Typography>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700">
          <div>
            <span className="text-gray-400 block mb-0.5">Runtime:</span>
            <strong>Node.js &gt;= 20.0.0</strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Database:</span>
            <strong>PostgreSQL 14+ / Neon</strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Memory:</span>
            <strong>512 MB RAM (Min)</strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Architecture:</span>
            <strong>x86_64 / Apple ARM64</strong>
          </div>
        </div>
      </Card>
    </div>
  );
};
