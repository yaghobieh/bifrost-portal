import type { PlanId, TranslateStatus } from './Plans.types';
import { TRANSLATE_CATALOGS_PATH } from '@const/strings.const';

export const PLAN_ID = {
  STANDARD: 'standard',
  AI: 'ai',
} as const satisfies Record<string, PlanId>;

export const TRANSLATE_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const satisfies Record<string, TranslateStatus>;

export const TRANSLATE_LOCALES = ['es', 'he', 'fr', 'de'] as const;

export { TRANSLATE_CATALOGS_PATH };

export const PLANS_DOC_INSTALLATION = 'installation';

export const HTTP_METHOD_POST = 'POST';

export const HEADER_CONTENT_TYPE = 'Content-Type';

export const CONTENT_TYPE_JSON = 'application/json';

export const STANDARD_FEATURE_KEYS = [
  'plans.standardFeatStage',
  'plans.standardFeatApi',
  'plans.standardFeatLocales',
  'plans.standardFeatHost',
  'plans.standardFeatDocs',
] as const;

export const AI_FEATURE_KEYS = [
  'plans.aiFeatStandard',
  'plans.aiFeatTranslate',
  'plans.aiFeatSuggest',
  'plans.aiFeatCrew',
  'plans.aiFeatMultisite',
] as const;
