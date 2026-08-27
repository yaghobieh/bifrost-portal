import type { FC, KeyboardEvent } from 'react';
import { Button, Flex, Input } from '@forgedevstack/bear';
import { CMS_KEY_ENTER } from '@pages/Cms/CmsShell/CmsShell.const';
import type { TranslationAddBarProps } from './TranslationAddBar.types';

export const TranslationAddBar: FC<TranslationAddBarProps> = (props) => {
  const {
    keyValue,
    sourceValue,
    keyPlaceholder,
    valuePlaceholder,
    addLabel,
    onKey,
    onValue,
    onAdd,
  } = props;

  const onEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== CMS_KEY_ENTER) {
      return;
    }
    event.preventDefault();
    onAdd();
  };

  return (
    <Flex gap={2} wrap="wrap" align="end" className="bifrost-cms-translations__add">
      <Input
        size="sm"
        value={keyValue}
        placeholder={keyPlaceholder}
        onChange={(event) => onKey(event.target.value)}
        onKeyDown={onEnter}
      />
      <Input
        size="sm"
        value={sourceValue}
        placeholder={valuePlaceholder}
        onChange={(event) => onValue(event.target.value)}
        onKeyDown={onEnter}
      />
      <Button size="sm" variant="outline" onClick={onAdd}>
        {addLabel}
      </Button>
    </Flex>
  );
};
