import type { FC, KeyboardEvent } from 'react';
import { Button, Flex, Input } from '@forgedevstack/bear';
import { CMS_KEY_ENTER } from '@pages/Cms/CmsShell/CmsShell.const';
import type { TranslationAddPageProps } from './TranslationAddPage.types';

export const TranslationAddPage: FC<TranslationAddPageProps> = (props) => {
  const { titleValue, titlePlaceholder, addLabel, onTitle, onAdd } = props;

  const onEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== CMS_KEY_ENTER) {
      return;
    }
    event.preventDefault();
    onAdd();
  };

  return (
    <Flex gap={2} wrap="wrap" align="end" className="bifrost-cms-translations__add-page">
      <Input
        size="sm"
        value={titleValue}
        placeholder={titlePlaceholder}
        onChange={(event) => onTitle(event.target.value)}
        onKeyDown={onEnter}
      />
      <Button size="sm" variant="outline" onClick={onAdd}>
        {addLabel}
      </Button>
    </Flex>
  );
};
