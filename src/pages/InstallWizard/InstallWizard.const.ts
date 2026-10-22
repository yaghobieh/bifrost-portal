import type { InstallConfig, WizardStepId } from './InstallWizard.types';

export const CMS_INSTALL_CONFIG_KEY = 'bifrost-cms-install-config';

export const WIZARD_STEPS: { id: WizardStepId; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'site',
    title: 'Site & Admin',
    subtitle: 'Brand identity & super admin',
    icon: '🏰',
  },
  {
    id: 'database',
    title: 'Database ENV',
    subtitle: 'SQLite, Postgres, or MySQL',
    icon: '🗄️',
  },
  {
    id: 'storage',
    title: 'Media Storage',
    subtitle: 'Cloudinary, S3, or Local',
    icon: '☁️',
  },
  {
    id: 'ai-security',
    title: 'AI & Security',
    subtitle: 'Gemini Copilot & JWT Secrets',
    icon: '🔐',
  },
  {
    id: 'git-deploy',
    title: 'Git & Deploy',
    subtitle: 'Auto-commit & Vercel rollout',
    icon: '🚀',
  },
];

export const DEFAULT_INSTALL_CONFIG: InstallConfig = {
  // Step 1
  siteName: 'My Bifrost Project',
  tagline: 'Enterprise Multi-Site Headless Content Engine',
  adminName: 'Admin',
  adminEmail: 'admin@forge.dev',
  adminPassword: 'Password123!',
  locale: 'en',

  // Step 2
  dbEngine: 'sqlite',
  dbUrl: 'file:./dev.db',
  dbHost: 'localhost',
  dbPort: '5432',
  dbName: 'bifrost_production',
  dbUser: 'postgres',
  dbPassword: '',

  // Step 3
  storageProvider: 'cloudinary',
  cloudName: 'bifrost-assets',
  cloudinaryApiKey: '',
  cloudinarySecret: '',
  s3Bucket: 'bifrost-media-bucket',
  s3Region: 'us-east-1',
  s3AccessKey: '',
  s3SecretKey: '',

  // Step 4
  geminiApiKey: '',
  jwtSecret: 'bf_sec_89df2b1a9e3347cda772183eef098192a8e71b23984',
  sessionExpiryDays: '30',

  // Step 5
  gitPlatform: 'github',
  gitToken: '',
  gitRepo: 'yaghobieh/bifrost',
  gitBranch: 'main',
  commitMessage: 'chore(config): configure production environment via Bifrost installer',
  autoDeployVercel: true,
};
