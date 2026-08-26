export type VersionDockerInfo = {
  running: boolean;
  hostname: string;
  image: string;
  containerName: string;
};

export type VersionBuildInfo = {
  sha: string;
  time: string;
  number: string;
};

export type VersionInfo = {
  product: string;
  version: string;
  ink: string;
  portal: string;
  node: string;
  platform: string;
  arch: string;
  env: string;
  uptimeSec: number;
  docker: VersionDockerInfo;
  build: VersionBuildInfo;
  packages: Record<string, string>;
  notes: string;
};

export type CmsUpdateResult = {
  from: string;
  to: string;
  updated: boolean;
  packages: string[];
  notes: string;
};

export type WhatsNewCopy = {
  title: string;
  lead: string;
  body: string;
};
