import type {
  DatabaseOption,
  FrontendStarter,
  PackageManager,
} from './GetStarted.types';

export const DATABASE_OPTIONS: { id: DatabaseOption; name: string; desc: string; badge: string }[] = [
  {
    id: 'sqlite',
    name: 'SQLite (Zero Config)',
    desc: 'Lightweight file-based database. Instant launch with no server setup required.',
    badge: 'Recommended for Dev',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL (Enterprise)',
    desc: 'High performance relational database with JSONB indexing and pooled connections.',
    badge: 'Production Ready',
  },
  {
    id: 'mysql',
    name: 'MySQL / MariaDB',
    desc: 'Classic scalable database engine compatible with standard Cloud SQL hosts.',
    badge: 'Cloud Ready',
  },
];

export const STARTER_OPTIONS: { id: FrontendStarter; name: string; tag: string }[] = [
  { id: 'nextjs', name: 'Next.js 14 App Router', tag: 'Full Stack' },
  { id: 'react-vite', name: 'React + Vite SPA', tag: 'Client Side' },
  { id: 'astro', name: 'Astro Content Collections', tag: 'Static SSG' },
  { id: 'api-only', name: 'Headless API Engine Only', tag: 'Backend' },
];

export const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

export const SYSTEM_REQUIREMENTS = [
  { label: 'Node.js Runtime', spec: 'v18.16.0 or v20.x LTS', status: 'verified' },
  { label: 'Package Manager', spec: 'npm >= 9, pnpm >= 8, or bun >= 1.0', status: 'verified' },
  { label: 'Operating System', spec: 'macOS, Linux (Ubuntu/Debian), Windows WSL2', status: 'verified' },
  { label: 'Container Engine', spec: 'Docker & Docker Compose (optional)', status: 'optional' },
  { label: 'Default Ports', spec: 'Port 5174 (Portal), Port 3001 (cms-api)', status: 'verified' },
];

export const CLI_ASCII_ART = `
 ╭───────────────────────  BIFROST  ───────────────────────╮
 │                                                         │
 │  ██████╗ ██╗███████╗██████╗  ██████╗ ███████╗████████╗  │
 │  ██╔══██╗██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝  │
 │  ██████╔╝██║█████╗  ██████╔╝██║   ██║███████╗   ██║     │
 │  ██╔══██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║   ██║     │
 │  ██████╔╝██║██║     ██║  ██║╚██████╔╝███████║   ██║     │
 │  ╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝     │
 │                                                         │
 │  Bifrost CMS  v1.0.2  ·  by ForgeStack                  │
 │  Enterprise Multi-Site Headless Content Engine          │
 │                                                         │
 ╰─────────────────────────────────────────────────────────╯
`.trim();

export const SAMPLE_PACKAGE_JSON = (projectName: string) =>
  JSON.stringify(
    {
      name: projectName,
      version: '1.0.2',
      private: true,
      description: 'Bifrost Headless CMS Project',
      scripts: {
        dev: 'bifrost run',
        build: 'bifrost deploy --engine docker',
        check: 'bifrost check',
      },
      dependencies: {
        '@forgedevstack/bifrost-cli': '^1.0.2',
        '@forgedevstack/bear': '^1.1.18',
      },
    },
    null,
    2
  );

export const SAMPLE_ENV_FILE = `# Bifrost CMS Environment Variables
PORT=5174
CMS_API_PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CMS_ADMIN_EMAIL="admin@forge.dev"
CMS_DEFAULT_LOCALE="en"
`;

export const SAMPLE_README_MD = (projectName: string) => `# ${projectName}

Powered by **Bifrost CMS** (by ForgeStack).

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development environment:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5174/cms](http://localhost:5174/cms) in your browser.
`;
