import type { FC } from 'react';
import { Typography } from '@forgedevstack/bear';
import { TRANSLATION_STATUS } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.const';
import type { TranslationStatusPillProps } from './TranslationStatusPill.types';
import { pillClassName, pillLabel } from './TranslationStatusPill.utils';

export const TranslationStatusPill: FC<TranslationStatusPillProps> = (props) => {
  const { status, doneLabel, missingLabel, aiLabel } = props;
  const label = pillLabel({ status, doneLabel, missingLabel, aiLabel });
  return (
    <Typography variant="caption" className={pillClassName(status)}>
      {label}
    </Typography>
  );
};
