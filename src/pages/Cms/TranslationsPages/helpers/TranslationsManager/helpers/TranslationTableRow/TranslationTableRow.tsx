import type { FC } from 'react';
import { BearIcons, Button, Flex, Input, Typography } from '@forgedevstack/bear';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import { TRANSLATION_STATUS } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.const';
import { TranslationStatusPill } from '../TranslationStatusPill';
import type { TranslationTableRowProps } from './TranslationTableRow.types';
import { targetInputClass } from './TranslationTableRow.utils';

export const TranslationTableRow: FC<TranslationTableRowProps> = (props) => {
  const {
    row,
    placeholder,
    acceptLabel,
    rejectLabel,
    translateOneLabel,
    doneLabel,
    missingLabel,
    aiLabel,
    busy,
    onTarget,
    onAccept,
    onReject,
    onTranslateOne,
  } = props;
  const isAi = row.status === TRANSLATION_STATUS.AI;

  return (
    <Flex align="center" gap={2} className="bifrost-cms-translations__row">
      <Typography variant="caption" className="bifrost-cms-translations__key mb-0">
        {row.key}
      </Typography>
      <Typography variant="body2" className="bifrost-cms-translations__source mb-0">
        {row.source}
      </Typography>
      <Input
        size="sm"
        fullWidth
        value={row.target}
        placeholder={placeholder}
        className={targetInputClass(row.status)}
        onChange={(event) => onTarget(row.key, event.target.value)}
      />
      <TranslationStatusPill
        status={row.status}
        doneLabel={doneLabel}
        missingLabel={missingLabel}
        aiLabel={aiLabel}
      />
      {isAi ? (
        <Flex gap={1} align="center" className="bifrost-cms-translations__row-actions">
          <Button size="sm" variant="outline" className="bifrost-cms-translations__accept" onClick={() => onAccept(row.key)}>
            {acceptLabel}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={rejectLabel}
            onClick={() => onReject(row.key)}
          >
            <BearIcons.XIcon size={CMS_ICON_SIZE} />
          </Button>
        </Flex>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="bifrost-cms-translations__star"
          aria-label={translateOneLabel}
          disabled={busy}
          onClick={() => onTranslateOne(row.key)}
        >
          <BearIcons.StarIcon size={CMS_ICON_SIZE} />
        </Button>
      )}
    </Flex>
  );
};
