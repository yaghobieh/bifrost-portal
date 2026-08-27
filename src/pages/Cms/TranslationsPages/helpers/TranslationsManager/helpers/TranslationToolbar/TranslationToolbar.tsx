import { useRef, type ChangeEvent, type FC, type KeyboardEvent } from 'react';
import { BearIcons, Button, Flex, Input } from '@forgedevstack/bear';
import { CMS_ICON_SIZE, NUMBER_ZERO } from '@const/numbers.const';
import { CMS_KEY_ENTER } from '@pages/Cms/CmsShell/CmsShell.const';
import { EMPTY_STRING } from '@const/strings.const';
import {
  TRANSLATION_FILE_ACCEPT,
  TRANSLATION_IMPORT_ID,
  TRANSLATION_SOURCE_SEP,
  TRANSLATION_VIEW,
} from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.const';
import type { TranslationToolbarProps } from './TranslationToolbar.types';

export const TranslationToolbar: FC<TranslationToolbarProps> = (props) => {
  const {
    locales,
    sourceLocale,
    activeLocale,
    query,
    view,
    addLocaleOpen,
    addLocaleValue,
    sourceLabel,
    addLocaleLabel,
    searchLabel,
    importLabel,
    exportLabel,
    tableLabel,
    jsonLabel,
    onLocale,
    onQuery,
    onView,
    onImportFile,
    onExport,
    onToggleAddLocale,
    onAddLocaleValue,
    onAddLocale,
  } = props;
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[NUMBER_ZERO];
    if (!file) {
      return;
    }
    onImportFile(file);
    event.target.value = EMPTY_STRING;
  };

  const onAddKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== CMS_KEY_ENTER) {
      return;
    }
    event.preventDefault();
    onAddLocale();
  };

  return (
    <Flex gap={2} wrap="wrap" align="center" className="bifrost-cms-translations__toolbar">
      <Flex gap={1} wrap="wrap" align="center" className="bifrost-cms-translations__locales">
        {locales.map((code) => {
          const isActive = code === activeLocale;
          const isSource = code === sourceLocale;
          let label = code.toUpperCase();
          if (isSource) {
            label = `${code.toUpperCase()}${TRANSLATION_SOURCE_SEP}${sourceLabel}`;
          }
          return (
            <Button
              key={code}
              size="sm"
              variant={isActive ? 'ink' : 'outline'}
              onClick={() => onLocale(code)}
            >
              {label}
            </Button>
          );
        })}
        {addLocaleOpen ? (
          <Input
            size="sm"
            value={addLocaleValue}
            placeholder={addLocaleLabel}
            onChange={(event) => onAddLocaleValue(event.target.value)}
            onKeyDown={onAddKey}
            onBlur={onAddLocale}
          />
        ) : (
          <Button size="sm" variant="ghost" onClick={onToggleAddLocale}>
            {addLocaleLabel}
          </Button>
        )}
      </Flex>
      <Input
        className="bifrost-cms-translations__search"
        size="sm"
        value={query}
        placeholder={searchLabel}
        prefix={<BearIcons.SearchIcon size={CMS_ICON_SIZE} />}
        onChange={(event) => onQuery(event.target.value)}
      />
      <Flex gap={1} align="center" className="bifrost-cms-translations__actions">
        <input
          id={TRANSLATION_IMPORT_ID}
          ref={fileRef}
          type="file"
          accept={TRANSLATION_FILE_ACCEPT}
          className="bifrost-cms-translations__file"
          onChange={onFileChange}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          {importLabel}
        </Button>
        <Button size="sm" variant="outline" onClick={onExport}>
          {exportLabel}
        </Button>
        <Flex gap={0} className="bifrost-cms-translations__seg">
          <Button
            size="sm"
            variant={view === TRANSLATION_VIEW.TABLE ? 'ink' : 'outline'}
            onClick={() => onView(TRANSLATION_VIEW.TABLE)}
          >
            {tableLabel}
          </Button>
          <Button
            size="sm"
            variant={view === TRANSLATION_VIEW.JSON ? 'ink' : 'outline'}
            onClick={() => onView(TRANSLATION_VIEW.JSON)}
          >
            {jsonLabel}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
