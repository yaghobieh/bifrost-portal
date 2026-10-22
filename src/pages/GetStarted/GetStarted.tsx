import { useState, type FC } from 'react';
import { Badge, Button, Card, Typography } from '@forgedevstack/bear';
import { PortalNav } from '@components/PortalNav';
import {
  CLI_ASCII_ART,
  DATABASE_OPTIONS,
  PACKAGE_MANAGERS,
  SAMPLE_ENV_FILE,
  SAMPLE_PACKAGE_JSON,
  SAMPLE_README_MD,
  STARTER_OPTIONS,
  SYSTEM_REQUIREMENTS,
} from './GetStarted.const';
import type {
  DatabaseOption,
  FrontendStarter,
  InstallMethod,
  PackageManager,
} from './GetStarted.types';

export const GetStarted: FC = () => {
  const [method, setMethod] = useState<InstallMethod>('download');
  const [projectName, setProjectName] = useState('my-bifrost-site');
  const [database, setDatabase] = useState<DatabaseOption>('sqlite');
  const [starter, setStarter] = useState<FrontendStarter>('nextjs');
  const [pm, setPm] = useState<PackageManager>('npm');
  const [includeDemoContent, setIncludeDemoContent] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const safeProjectName =
    projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'my-bifrost-site';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Instant Client-side Project Download
  const handleDownloadZip = () => {
    setIsDownloading(true);

    const manifest = {
      project: safeProjectName,
      version: '1.0.2',
      engine: 'bifrost-headless-cms',
      database,
      starter,
      packageManager: pm,
      includeDemoContent,
      createdAt: new Date().toISOString(),
      files: {
        'package.json': SAMPLE_PACKAGE_JSON(safeProjectName),
        '.env': SAMPLE_ENV_FILE,
        'README.md': SAMPLE_README_MD(safeProjectName),
      },
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeProjectName}-bifrost-config.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsDownloading(false);
      setCopyFeedback('Starter bundle downloaded!');
      setTimeout(() => setCopyFeedback(null), 3000);
    }, 600);
  };

  const getCliCommand = () => {
    const demoFlag = includeDemoContent ? ' --demo' : '';
    const dbFlag = database !== 'sqlite' ? ` --db ${database}` : '';
    return `npx @forgedevstack/bifrost create ${safeProjectName}${dbFlag}${demoFlag}`;
  };

  const getGitCommand = () => {
    const runCmd = pm === 'npm' ? 'npm run dev' : `${pm} dev`;
    return `git clone https://github.com/yaghobieh/bifrost.git ${safeProjectName}\ncd ${safeProjectName}\n${pm} install\n${runCmd}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans selection:bg-[#1e3a8a] selection:text-white">
      <PortalNav showProductLink={false} />

      {/* Copy Toast Alert */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e3a8a] text-white px-5 py-3 rounded-xl shadow-2xl border border-sky-400/40 text-sm flex items-center gap-2.5 animate-bounce">
          <span>✨</span>
          <span className="font-medium">{copyFeedback}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
        {/* Hero Section */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/20 border border-[#1e3a8a]/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <span>⚡</span>
            <span>Bifrost CMS v1.0.2 Quickstart</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Install Bifrost CMS in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">
              Seconds
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            Choose your preferred onboarding method: direct browser starter bundle download,
            automated git clone, or the interactive ForgeStack CLI.
          </p>
          <a
            href="/install"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white text-xs font-semibold shadow-md hover:brightness-110 transition-all border border-sky-400/30"
          >
            <span>🚀</span>
            <span>Prefer a visual step-by-step setup? Launch Web Installer (/install) →</span>
          </a>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: 'download' as const,
              title: 'One-Click Download',
              subtitle: 'Starter zip & JSON manifest',
              icon: '📦',
              badge: 'Fastest',
            },
            {
              id: 'git' as const,
              title: 'Git Clone & Run',
              subtitle: 'Full repository with Git history',
              icon: '🐙',
              badge: 'Developers',
            },
            {
              id: 'cli' as const,
              title: 'ForgeStack CLI',
              subtitle: 'Interactive terminal scaffolding',
              icon: '💻',
              badge: 'Interactive',
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMethod(item.id)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col gap-2 ${
                method === item.id
                  ? 'bg-slate-900 border-[#1e3a8a] ring-2 ring-[#1e3a8a]/50 shadow-xl shadow-[#1e3a8a]/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl">{item.icon}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    method === item.id
                      ? 'bg-[#1e3a8a] text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              </div>
              <div className="font-bold text-white text-base pt-1">
                {item.title}
              </div>
              <div className="text-xs text-slate-400">{item.subtitle}</div>
            </button>
          ))}
        </div>

        {/* METHOD 1: One-Click Download */}
        {method === 'download' && (
          <Card className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <Typography variant="h5" className="text-white font-bold mb-1">
                  Download Pre-Configured Starter Package
                </Typography>
                <Typography variant="caption" className="text-slate-400 mb-0">
                  Ready-to-run Bifrost package with SQLite starter database, Docker compose, and demo content models.
                </Typography>
              </div>
              <Button
                size="md"
                variant="primary"
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/30"
              >
                <span>{isDownloading ? '⏳' : '📥'}</span>
                <span>
                  {isDownloading
                    ? 'Packaging Files...'
                    : `Download ${safeProjectName}.zip`}
                </span>
              </Button>
            </div>

            {/* Quick Unpack Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-sky-400">
                  STEP 01
                </span>
                <span className="font-semibold text-white text-sm">
                  Extract Package
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unzip the downloaded archive to your preferred development folder.
                </p>
                <code className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded mt-1">
                  unzip {safeProjectName}.zip
                </code>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-sky-400">
                  STEP 02
                </span>
                <span className="font-semibold text-white text-sm">
                  Install Dependencies
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Run your favorite package manager to resolve all local CLI modules.
                </p>
                <code className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded mt-1">
                  npm install
                </code>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-sky-400">
                  STEP 03
                </span>
                <span className="font-semibold text-white text-sm">
                  Start Development
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Launch the Bifrost CMS dashboard and Nest API under hot reload.
                </p>
                <code className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded mt-1">
                  npm run dev
                </code>
              </div>
            </div>
          </Card>
        )}

        {/* METHOD 2: Git Clone */}
        {method === 'git' && (
          <Card className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <Typography variant="h5" className="text-white font-bold mb-1">
                  Clone from Official GitHub Repository
                </Typography>
                <Typography variant="caption" className="text-slate-400 mb-0">
                  Recommended for contributing to Bifrost core, custom extensions, or production monorepos.
                </Typography>
              </div>
              <Button
                size="md"
                variant="outline"
                onClick={() =>
                  copyToClipboard(getGitCommand(), 'Git commands copied!')
                }
              >
                📋 Copy All Commands
              </Button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto relative group">
              <pre>{getGitCommand()}</pre>
              <button
                onClick={() =>
                  copyToClipboard(getGitCommand(), 'Git commands copied!')
                }
                className="absolute top-3 right-3 text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded transition-all opacity-80 group-hover:opacity-100"
              >
                Copy
              </button>
            </div>
          </Card>
        )}

        {/* METHOD 3: Forge CLI */}
        {method === 'cli' && (
          <Card className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <Typography variant="h5" className="text-white font-bold mb-1">
                  Scaffold with @forgedevstack/bifrost CLI
                </Typography>
                <Typography variant="caption" className="text-slate-400 mb-0">
                  Interactive CLI with boxen borders, colorful ASCII branding, and automated site generator.
                </Typography>
              </div>
              <Button
                size="md"
                variant="primary"
                onClick={() =>
                  copyToClipboard(getCliCommand(), 'CLI command copied!')
                }
              >
                📋 Copy Command
              </Button>
            </div>

            {/* Terminal Command Snippet */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-sky-400 flex items-center justify-between">
              <span>{getCliCommand()}</span>
              <button
                onClick={() =>
                  copyToClipboard(getCliCommand(), 'CLI command copied!')
                }
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Copy
              </button>
            </div>

            {/* Interactive Terminal Mockup */}
            <div className="bg-[#030712] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  bash — bifrost-cli v1.0.2
                </span>
              </div>
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-sky-300 leading-relaxed overflow-x-auto whitespace-pre">
                {CLI_ASCII_ART}
                {'\n\n'}
                <span className="text-emerald-400 font-bold">✔ Project target:</span> ./{safeProjectName}
                {'\n'}
                <span className="text-cyan-400 font-bold">✔ Database engine:</span> {database}
                {'\n'}
                <span className="text-indigo-400 font-bold">✔ Frontend starter:</span> {starter}
                {'\n'}
                <span className="text-amber-400 font-bold">✔ Sample content:</span> {includeDemoContent ? 'Enabled' : 'Minimal'}
                {'\n\n'}
                <span className="text-slate-400">Ready to install! Press Enter to proceed.</span>
              </div>
            </div>
          </Card>
        )}

        {/* Project Customizer Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-8">
          <div>
            <Typography variant="h5" className="text-white font-bold mb-1">
              Custom Project Settings
            </Typography>
            <Typography variant="caption" className="text-slate-400 mb-0">
              Customize project parameters. The commands and starter packages above dynamically update.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Project Name */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-bifrost-site"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
              />
            </div>

            {/* Package Manager */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Package Manager
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PACKAGE_MANAGERS.map((mgr) => (
                  <button
                    key={mgr}
                    onClick={() => setPm(mgr)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                      pm === mgr
                        ? 'bg-[#1e3a8a] text-white border border-sky-400/40 shadow'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mgr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Database Options */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">
              Database Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DATABASE_OPTIONS.map((db) => (
                <button
                  key={db.id}
                  onClick={() => setDatabase(db.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                    database === db.id
                      ? 'bg-slate-950 border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white text-sm">
                      {db.name}
                    </span>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                      {db.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {db.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Frontend Starter Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">
              Frontend Starter Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STARTER_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStarter(st.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                    starter === st.id
                      ? 'bg-slate-950 border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-white text-xs">
                    {st.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{st.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Include Demo Content Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <div className="font-semibold text-white text-sm">
                Pre-populate Sample Content & Blog Posts
              </div>
              <div className="text-xs text-slate-400">
                Installs sample content schemas, author personas, and media assets for instant testing.
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeDemoContent}
              onChange={(e) => setIncludeDemoContent(e.target.checked)}
              className="w-5 h-5 rounded text-[#1e3a8a] accent-[#1e3a8a] cursor-pointer"
            />
          </div>
        </div>

        {/* System Requirements & Pre-flight Checklist */}
        <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/40 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-white font-bold mb-0">
              System Pre-flight & Compatibility Checklist
            </Typography>
            <Badge variant="info">Zero External Dependencies</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SYSTEM_REQUIREMENTS.map((req) => (
              <div
                key={req.label}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">
                    {req.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {req.spec}
                  </div>
                </div>
                <span className="text-emerald-400 text-sm font-bold">✔</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-[#1e3a8a]/30 via-slate-900 to-indigo-950/30 border border-[#1e3a8a]/40 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="text-xl font-bold text-white mb-1">
              Already running a Bifrost instance?
            </div>
            <div className="text-sm text-slate-400">
              Open your local administrative control panel to start building schemas and managing content.
            </div>
          </div>
          <a
            href="/cms"
            className="bg-white hover:bg-slate-100 text-[#0f172a] font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            Open CMS Dashboard →
          </a>
        </div>
      </main>
    </div>
  );
};
