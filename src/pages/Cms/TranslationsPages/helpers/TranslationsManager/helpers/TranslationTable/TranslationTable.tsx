import type { FC } from 'react';
import { Flex, Typography } from '@forgedevstack/bear';
import { TranslationTableRow } from '../TranslationTableRow';
import type { TranslationTableProps } from './TranslationTable.types';

export const TranslationTable: FC<TranslationTableProps> = (props) => {
  const {
    rows,
    keyHeader,
    sourceHeader,
    targetHeader,
    statusHeader,
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

  return (
    <Flex direction="column" className="bifrost-cms-translations__table">
      <Flex align="center" gap={2} className="bifrost-cms-translations__head">
        <Typography variant="caption" className="bifrost-cms-translations__th mb-0">
          {keyHeader}
        </Typography>
        <Typography variant="caption" className="bifrost-cms-translations__th mb-0">
          {sourceHeader}
        </Typography>
        <Typography variant="caption" className="bifrost-cms-translations__th mb-0">
          {targetHeader}
        </Typography>
        <Typography variant="caption" className="bifrost-cms-translations__th mb-0">
          {statusHeader}
        </Typography>
        <Flex className="bifrost-cms-translations__th-spacer" />
      </Flex>
      {rows.map((row) => (
        <TranslationTableRow
          key={row.id}
          row={row}
          placeholder={placeholder}
          acceptLabel={acceptLabel}
          rejectLabel={rejectLabel}
          translateOneLabel={translateOneLabel}
          doneLabel={doneLabel}
          missingLabel={missingLabel}
          aiLabel={aiLabel}
          busy={busy}
          onTarget={onTarget}
          onAccept={onAccept}
          onReject={onReject}
          onTranslateOne={onTranslateOne}
        />
      ))}
    </Flex>
  );
};
