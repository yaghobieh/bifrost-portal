export type PlanId = 'standard' | 'ai';

export type TranslateStatus = 'idle' | 'loading' | 'success' | 'error';

export type TranslateCatalogsResponse = {
  translated: boolean;
  locales: string[];
};

export type TranslateCatalogsBody = {
  locales: string[];
};

export type PlansProps = Record<string, never>;
