export type InstallMethod = 'download' | 'git' | 'cli';

export type DatabaseOption = 'sqlite' | 'postgres' | 'mysql';

export type FrontendStarter = 'nextjs' | 'react-vite' | 'astro' | 'api-only';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type GetStartedConfig = {
  projectName: string;
  installMethod: InstallMethod;
  database: DatabaseOption;
  starter: FrontendStarter;
  packageManager: PackageManager;
  includeDemoContent: boolean;
};
