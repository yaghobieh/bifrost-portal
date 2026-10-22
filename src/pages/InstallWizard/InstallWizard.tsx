import { useState, useEffect, type FC } from 'react';
import { Badge, Button, Card, Typography } from '@forgedevstack/bear';
import { PortalNav } from '@components/PortalNav';
import { WIZARD_STEPS } from './InstallWizard.const';
import type {
  ConnectionTestResult,
  DatabaseEngine,
  InstallConfig,
  StorageProvider,
  WizardStepId,
} from './InstallWizard.types';
import {
  deployToGitRepository,
  generateEnvFile,
  generateRandomSecret,
  loadInstallConfig,
  saveInstallConfig,
  testDatabaseConnection,
  testStorageCredentials,
} from './InstallWizard.utils';

export const InstallWizard: FC = () => {
  const [config, setConfig] = useState<InstallConfig>(loadInstallConfig);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dbTestResult, setDbTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [storageTestResult, setStorageTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTestingStorage, setIsTestingStorage] = useState(false);
  const [gitDeployResult, setGitDeployResult] = useState<{
    success: boolean;
    message: string;
    commitSha?: string;
  } | null>(null);
  const [isDeployingGit, setIsDeployingGit] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  useEffect(() => {
    saveInstallConfig(config);
  }, [config]);

  const currentStep = WIZARD_STEPS[currentStepIndex];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateConfig = <K extends keyof InstallConfig>(key: K, value: InstallConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleTestDb = async () => {
    setIsTestingDb(true);
    const res = await testDatabaseConnection(config);
    setDbTestResult(res);
    setIsTestingDb(false);
  };

  const handleTestStorage = async () => {
    setIsTestingStorage(true);
    const res = await testStorageCredentials(config);
    setStorageTestResult(res);
    setIsTestingStorage(false);
  };

  const handleDeployToGit = async () => {
    setIsDeployingGit(true);
    const envContent = generateEnvFile(config);
    const res = await deployToGitRepository(config, envContent);
    setGitDeployResult(res);
    setIsDeployingGit(false);
    showToast(res.message);
  };

  const handleCopyEnv = () => {
    const env = generateEnvFile(config);
    navigator.clipboard.writeText(env);
    setCopiedEnv(true);
    showToast('Copied .env to clipboard!');
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleDownloadEnv = () => {
    const env = generateEnvFile(config);
    const blob = new Blob([env], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.production';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded .env.production file!');
  };

  const nextStep = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-[#1e3a8a] selection:text-white">
      <PortalNav showProductLink={false} />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e3a8a] text-white px-5 py-3 rounded-xl shadow-2xl border border-sky-400/40 text-sm flex items-center gap-2.5 animate-fade-in">
          <span>🚀</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/20 border border-[#1e3a8a]/40 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <span>⚙️</span>
            <span>Bifrost Guided Setup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Installation & Deployment Wizard
          </h1>
          <p className="text-slate-400 text-sm max-w-lg">
            Connect all database, storage, AI, and security environments, test live connectivity, and deploy directly to your Git repository.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {WIZARD_STEPS.map((st, idx) => {
              const isActive = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#1e3a8a]/30 border border-[#1e3a8a] ring-1 ring-[#1e3a8a]/60 shadow-lg shadow-[#1e3a8a]/10'
                      : isPassed
                        ? 'bg-slate-950/60 border border-emerald-900/40 text-emerald-300'
                        : 'bg-slate-950/30 border border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-[#1e3a8a] text-white shadow'
                        : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? '✔' : idx + 1}
                  </div>
                  <div className="hidden sm:flex flex-col min-w-0">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive
                          ? 'text-white'
                          : isPassed
                            ? 'text-emerald-300'
                            : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {st.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <Card className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          {/* STEP 1: Site Identity & Super Admin */}
          {currentStep.id === 'site' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <Typography variant="h5" className="text-white font-bold mb-1">
                  1. Brand Identity & Super Admin
                </Typography>
                <Typography variant="caption" className="text-slate-400 mb-0">
                  Establish the primary title and universal administrator credentials for this deployment.
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Site / Network Title
                  </label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => updateConfig('siteName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => updateConfig('tagline', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Super Admin Name
                  </label>
                  <input
                    type="text"
                    value={config.adminName}
                    onChange={(e) => updateConfig('adminName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Super Admin Email
                  </label>
                  <input
                    type="email"
                    value={config.adminEmail}
                    onChange={(e) => updateConfig('adminEmail', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    value={config.adminPassword}
                    onChange={(e) => updateConfig('adminPassword', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Database Configuration */}
          {currentStep.id === 'database' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4 flex justify-between items-start sm:items-center">
                <div>
                  <Typography variant="h5" className="text-white font-bold mb-1">
                    2. Database Engine & Connection
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 mb-0">
                    Bifrost supports embedded SQLite for local/edge deployments or PostgreSQL/MySQL for high concurrency.
                  </Typography>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTestDb}
                  disabled={isTestingDb}
                >
                  {isTestingDb ? 'Testing...' : '⚡ Test Connection'}
                </Button>
              </div>

              {/* Engine Selector */}
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ['sqlite', 'SQLite (Zero Config)', 'dev.db file'],
                    ['postgres', 'PostgreSQL', 'Port 5432'],
                    ['mysql', 'MySQL / MariaDB', 'Port 3306'],
                  ] as const
                ).map(([eng, label, hint]) => (
                  <button
                    key={eng}
                    onClick={() => updateConfig('dbEngine', eng as DatabaseEngine)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      config.dbEngine === eng
                        ? 'bg-slate-950 border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <span className="font-semibold text-white text-xs">
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-400">{hint}</span>
                  </button>
                ))}
              </div>

              {/* SQLite path */}
              {config.dbEngine === 'sqlite' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    SQLite Database File Path
                  </label>
                  <input
                    type="text"
                    value={config.dbUrl}
                    onChange={(e) => updateConfig('dbUrl', e.target.value)}
                    placeholder="file:./dev.db"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-xs text-sky-300 outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Host
                    </label>
                    <input
                      type="text"
                      value={config.dbHost}
                      onChange={(e) => updateConfig('dbHost', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Port
                    </label>
                    <input
                      type="text"
                      value={config.dbPort}
                      onChange={(e) => updateConfig('dbPort', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      Database Name
                    </label>
                    <input
                      type="text"
                      value={config.dbName}
                      onChange={(e) => updateConfig('dbName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      User
                    </label>
                    <input
                      type="text"
                      value={config.dbUser}
                      onChange={(e) => updateConfig('dbUser', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* DB Test Output */}
              {dbTestResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                    dbTestResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{dbTestResult.success ? '✔' : '✖'}</span>
                    <span>{dbTestResult.message}</span>
                  </div>
                  {dbTestResult.latencyMs && (
                    <span className="font-mono text-[10px] opacity-80">
                      {dbTestResult.latencyMs}ms
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Storage & Media */}
          {currentStep.id === 'storage' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4 flex justify-between items-start sm:items-center">
                <div>
                  <Typography variant="h5" className="text-white font-bold mb-1">
                    3. Media Library & Object Storage
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 mb-0">
                    Configure asset uploads, responsive image CDN transformation, and file attachments.
                  </Typography>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTestStorage}
                  disabled={isTestingStorage}
                >
                  {isTestingStorage ? 'Testing...' : '⚡ Test Storage'}
                </Button>
              </div>

              {/* Storage Providers */}
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ['cloudinary', 'Cloudinary CDN', 'Dynamic WebP crops'],
                    ['s3', 'AWS S3 / R2', 'Private object buckets'],
                    ['local', 'Local Storage', './uploads folder'],
                  ] as const
                ).map(([prov, label, hint]) => (
                  <button
                    key={prov}
                    onClick={() => updateConfig('storageProvider', prov as StorageProvider)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      config.storageProvider === prov
                        ? 'bg-slate-950 border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <span className="font-semibold text-white text-xs">
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-400">{hint}</span>
                  </button>
                ))}
              </div>

              {config.storageProvider === 'cloudinary' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      Cloud Name
                    </label>
                    <input
                      type="text"
                      value={config.cloudName}
                      onChange={(e) => updateConfig('cloudName', e.target.value)}
                      placeholder="bifrost-assets"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#1e3a8a]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={config.cloudinaryApiKey}
                      onChange={(e) => updateConfig('cloudinaryApiKey', e.target.value)}
                      placeholder="948192847192"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#1e3a8a]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={config.cloudinarySecret}
                      onChange={(e) => updateConfig('cloudinarySecret', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#1e3a8a]"
                    />
                  </div>
                </div>
              )}

              {config.storageProvider === 's3' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      S3 Bucket Name
                    </label>
                    <input
                      type="text"
                      value={config.s3Bucket}
                      onChange={(e) => updateConfig('s3Bucket', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      S3 Region
                    </label>
                    <input
                      type="text"
                      value={config.s3Region}
                      onChange={(e) => updateConfig('s3Region', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Storage Test Output */}
              {storageTestResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                    storageTestResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{storageTestResult.success ? '✔' : '✖'}</span>
                    <span>{storageTestResult.message}</span>
                  </div>
                  {storageTestResult.latencyMs && (
                    <span className="font-mono text-[10px] opacity-80">
                      {storageTestResult.latencyMs}ms
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: AI & Security */}
          {currentStep.id === 'ai-security' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <Typography variant="h5" className="text-white font-bold mb-1">
                  4. AI Assistant & Token Security
                </Typography>
                <Typography variant="caption" className="text-slate-400 mb-0">
                  Configure Gemini 1.5 Flash for the Alloy CMS Copilot and rotate cryptographically secure JWT tokens.
                </Typography>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Google Gemini API Key (Alloy 1.5 Flash Copilot)
                </label>
                <input
                  type="password"
                  value={config.geminiApiKey}
                  onChange={(e) => updateConfig('geminiApiKey', e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#1e3a8a]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Enables smart layout generation, real-time schema generation, and multilingual content translations.
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    JWT Session Secret
                  </label>
                  <button
                    onClick={() => updateConfig('jwtSecret', generateRandomSecret())}
                    className="text-xs text-sky-400 hover:text-sky-300 underline"
                  >
                    Generate New Secret
                  </button>
                </div>
                <input
                  type="text"
                  value={config.jwtSecret}
                  onChange={(e) => updateConfig('jwtSecret', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono outline-none focus:border-[#1e3a8a]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Git & Deploy */}
          {currentStep.id === 'git-deploy' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <Typography variant="h5" className="text-white font-bold mb-1">
                  5. Git Repository Auto-Deploy & Production Release
                </Typography>
                <Typography variant="caption" className="text-slate-400 mb-0">
                  Commit your customized environment configuration directly to GitHub, download the .env, or trigger a cloud deploy.
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Target GitHub Repository
                  </label>
                  <input
                    type="text"
                    value={config.gitRepo}
                    onChange={(e) => updateConfig('gitRepo', e.target.value)}
                    placeholder="owner/repo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    GitHub Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={config.gitToken}
                    onChange={(e) => updateConfig('gitToken', e.target.value)}
                    placeholder="ghp_••••••••••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              {/* Commit and Push Action */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">
                    Automated Git Push
                  </div>
                  <div className="text-xs text-slate-400">
                    Commits .env.production directly to branch "{config.gitBranch || 'main'}".
                  </div>
                </div>
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleDeployToGit}
                  disabled={isDeployingGit}
                  className="bg-[#1e3a8a] text-white"
                >
                  {isDeployingGit ? 'Deploying...' : '🚀 Commit & Deploy to Git'}
                </Button>
              </div>

              {/* Git Result Alert */}
              {gitDeployResult && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>✔</span>
                    <span>{gitDeployResult.message}</span>
                  </div>
                  {gitDeployResult.commitSha && (
                    <span className="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[11px]">
                      sha: {gitDeployResult.commitSha}
                    </span>
                  )}
                </div>
              )}

              {/* Generated .env Preview Container */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">
                    Generated Production .env File
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyEnv}
                      className="text-xs text-sky-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                    >
                      {copiedEnv ? 'Copied!' : 'Copy .env'}
                    </button>
                    <button
                      onClick={handleDownloadEnv}
                      className="text-xs text-sky-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                    >
                      Download .env
                    </button>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
                  <pre>{generateEnvFile(config)}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <Button
              size="sm"
              variant="outline"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
            >
              ← Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStepIndex < WIZARD_STEPS.length - 1 ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={nextStep}
                  className="bg-[#1e3a8a] text-white"
                >
                  Continue →
                </Button>
              ) : (
                <a
                  href="/cms"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all"
                >
                  <span>🎉</span>
                  <span>Finish & Launch CMS</span>
                </a>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};
