import type { FC } from 'react';
import { Button, Typography } from '@forgedevstack/bear';
import {
  CMS_ONBOARDING_ACTIVE_CLASS,
  CMS_ONBOARDING_STEP_BODY,
  CMS_ONBOARDING_STEP_CTA,
} from '@pages/Cms/CmsOnboarding/CmsOnboarding.const';
import type { OnboardingStepRowProps } from '@pages/Cms/CmsOnboarding/CmsOnboarding.types';

export const OnboardingStepRow: FC<OnboardingStepRowProps> = (props) => {
  const { id, navId, title, kind, ctaLabel, body, active, onStep } = props;
  const stepClass = active
    ? `bifrost-cms-onboarding__step ${CMS_ONBOARDING_ACTIVE_CLASS}`
    : 'bifrost-cms-onboarding__step';
  return (
    <li className={stepClass}>
      <span className="bifrost-cms-onboarding__node">{id}</span>
      <div className="bifrost-cms-onboarding__step-body">
        <Typography variant="h5" className="mb-1">
          {title}
        </Typography>
        {kind === CMS_ONBOARDING_STEP_CTA && (
          <Button variant="bifrost" className="bifrost-cms-onboarding__cta" onClick={() => onStep(navId)}>
            {ctaLabel}
          </Button>
        )}
        {kind === CMS_ONBOARDING_STEP_BODY && (
          <Typography variant="body2" className="bifrost-cms__muted mb-0">
            {body}
          </Typography>
        )}
      </div>
    </li>
  );
};
