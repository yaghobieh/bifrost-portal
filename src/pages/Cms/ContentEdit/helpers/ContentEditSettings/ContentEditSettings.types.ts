import type { ContentStatus } from '@sdk/modules/content';

export type ContentEditSettingsProps = {
  status: ContentStatus;
  statusOrder?: readonly ContentStatus[];
  slug: string;
  routePrefix: string;
  homepage: boolean;
  statusLabel: string;
  routeLabel: string;
  homepageLabel: string;
  homepageHint: string;
  visibilityHint: string;
  slugInputId: string;
  onStatus: (status: ContentStatus) => void;
  onSlug: (slug: string) => void;
  onHomepage: (value: boolean) => void;
};
