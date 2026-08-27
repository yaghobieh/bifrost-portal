import { useState, type FC } from 'react';
import { Button, Card, Flex, Input, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING } from '@const/index';
import { useCmsLive } from '../CmsShell/CmsLiveProvider';
import { defaultBoardConfig, loadBoardConfig, saveBoardConfig } from '../TasksPages/TasksPages.utils';
import { INIT_FALLBACK } from './BuilderBoardNiche.const';

export const BuilderBoardNiche: FC = () => {
  const { t } = useI18n();
  const live = useCmsLive();
  const fallback = defaultBoardConfig(INIT_FALLBACK(t.cmsTasks));
  const [label, setLabel] = useState(EMPTY_STRING);
  const board = live.board ?? loadBoardConfig(fallback);

  const addStatus = () => {
    const nextLabel = label.trim();
    if (!nextLabel) return;
    const id = nextLabel.toLowerCase().replace(/\s+/g, '-');
    if (board.statuses.some((item) => item.id === id)) return;
    const next = { ...board, statuses: [...board.statuses, { id, label: nextLabel }] };
    saveBoardConfig(next);
    live.publishTasks(live.tasks ?? [], next);
    setLabel(EMPTY_STRING);
  };

  return (
    <Card padding="md" className="bifrost-cms-builder__board-niche">
      <Flex direction="column" gap={2}>
        <Typography variant="h4">{t.cmsBuilder.boardNiche}</Typography>
        <Typography variant="caption">{t.cmsBuilder.boardNicheHint}</Typography>
        <Flex gap={2} wrap="wrap">
          {board.statuses.map((status) => (
            <Typography key={status.id} variant="caption">
              {status.label}
            </Typography>
          ))}
        </Flex>
        <Flex gap={2} align="end">
          <Input
            label={t.cmsTasks.addStatus}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <Button size="sm" variant="primary" disabled={!label.trim()} onClick={addStatus}>
            {t.cmsTasks.addStatus}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
