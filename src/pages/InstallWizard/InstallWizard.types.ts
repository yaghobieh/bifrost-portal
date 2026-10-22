export type WizardStepId =
  | 'site'
  | 'database'
  | 'storage'
  | 'ai-security'
  | 'git-deploy'
  | 'complete';

export type DatabaseEngine = 'sqlite' | 'postgres' | 'mysql';

export type StorageProvider = 'local' | 'cloudinary' | 's3';

export type InstallConfig = {
  // Step 1: Site & Super Admin
  siteName: string;
  tagline: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  locale: string;

  // Step 2: Database ENV
  dbEngine: DatabaseEngine;
  dbUrl: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;

  // Step 3: Storage & Media
  storageProvider: StorageProvider;
  cloudName: string;
  cloudinaryApiKey: string;
  cloudinarySecret: string;
  s3Bucket: string;
  s3Region: string;
  s3AccessKey: string;
  s3SecretKey: string;

  // Step 4: AI & Security
  geminiApiKey: string;
  jwtSecret: string;
  sessionExpiryDays: string;

  // Step 5: Git Auto-Deploy
  gitPlatform: 'github' | 'gitlab';
  gitToken: string;
  gitRepo: string;
  gitBranch: string;
  commitMessage: string;
  autoDeployVercel: boolean;
};

export type ConnectionTestResult = {
  tested: boolean;
  success: boolean;
  message: string;
  latencyMs?: number;
};
