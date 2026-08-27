import type { FC } from 'react';
import { Button, CodeEditor, Flex, Typography } from '@forgedevstack/bear';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { TranslationJsonPanelProps } from './TranslationJsonPanel.types';

export const TranslationJsonPanel: FC<TranslationJsonPanelProps> = (props) => {
  const { value, suggestedKeys, fillLabel, busy, onChange, onFill } = props;
  const hasSuggested = suggestedKeys.length > NUMBER_ZERO;

  return (
    <Flex direction="column" gap={2} className="bifrost-cms-translations__json">
      <Button size="sm" className="bifrost-cms-translations__ai-btn" disabled={busy} onClick={onFill}>
        {fillLabel}
      </Button>
      {hasSuggested && (
        <Flex gap={1} wrap="wrap" className="bifrost-cms-translations__json-ai">
          {suggestedKeys.map((key) => (
            <Typography key={key} variant="caption" className="bifrost-cms-translations__json-key mb-0">
              {key}
            </Typography>
          ))}
        </Flex>
      )}
      <CodeEditor
        value={value}
        onChange={onChange}
        language="json"
        theme="dark"
        showLineNumbers
        showGutter
        highlightActiveLine
      />
    </Flex>
  );
};
