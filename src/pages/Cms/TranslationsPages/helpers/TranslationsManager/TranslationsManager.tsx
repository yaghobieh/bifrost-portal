import { useEffect, useState, type FC } from 'react';
import { Alert, Button, Flex, Typography } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { CONTENT_TYPE_JSON, EMPTY_STRING, HEADER_CONTENT_TYPE } from '@const/strings.const';
import { HTTP_METHOD_POST, HTTP_NOT_IMPLEMENTED } from '@const/http.const';
import { INK_API_URL } from '@const/billing.const';
import { NUMBER_ZERO } from '@const/numbers.const';
import { TRANSLATE_CATALOGS_PATH } from '@pages/Plans/Plans.const';
import { CmsGridTable } from '@pages/Cms/CmsShell';
import {
  loadCmsTranslationsLocal,
  loadCmsTranslationsRemote,
  saveCmsTranslationsLocal,
  saveCmsTranslationsRemote,
} from '@pages/Cms/SettingsPages/SettingsPages.utils';
import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';
import { useApi } from '@sdk/http';
import { authHeaders } from '@sdk/modules/auth/auth.api';
import {
  TRANSLATION_DEFAULT_TARGET,
  TRANSLATION_EXPORT_NAME,
  TRANSLATION_GLOBAL_ID,
  TRANSLATION_JSON_INDENT,
  TRANSLATION_PAGE_COL,
  TRANSLATION_SCOPE,
  TRANSLATION_SEED,
  TRANSLATION_SOURCE_LOCALE,
  TRANSLATION_VIEW,
} from './TranslationsManager.const';
import type {
  TranslationLocale,
  TranslationLocaleNames,
  TranslationScopeId,
  TranslationViewId,
  TranslationsManagerProps,
} from './TranslationsManager.types';
import {
  acceptOneSuggested,
  addLocaleToBag,
  buildTranslationRows,
  countDone,
  countMissing,
  countSuggested,
  downloadJsonFile,
  emptyBag,
  fillTemplate,
  globalKeyCount,
  addKeyToBag,
  addPageToBag,
  isLocaleCode,
  isTranslationKey,
  listLocales,
  localeLanguageName,
  parseTranslationsJson,
  rejectSuggested,
  resolveTranslateCatalogs,
  seedIfEmpty,
  suggestedKeys,
  withLocaleTarget,
} from './TranslationsManager.utils';
import { TranslationAiBanner } from './helpers/TranslationAiBanner';
import { TranslationJsonPanel } from './helpers/TranslationJsonPanel';
import { TranslationTable } from './helpers/TranslationTable';
import { TranslationToolbar } from './helpers/TranslationToolbar';
import { TranslationAddBar } from './helpers/TranslationAddBar';
import { TranslationAddPage } from './helpers/TranslationAddPage';

export const TranslationsManager: FC<TranslationsManagerProps> = (props) => {
  const { pageId, onOpenPage, pages, onCreatePage } = props;
  const { t } = useI18n();
  const { token } = useAuth();
  const [bag, setBag] = useState<CmsTranslations>(() => loadCmsTranslationsLocal() || emptyBag());
  const [locale, setLocale] = useState<TranslationLocale>(TRANSLATION_DEFAULT_TARGET);
  const [view, setView] = useState<TranslationViewId>(TRANSLATION_VIEW.TABLE);
  const [scope, setScope] = useState<TranslationScopeId>(TRANSLATION_SCOPE.PAGE);
  const [query, setQuery] = useState(EMPTY_STRING);
  const [jsonDraft, setJsonDraft] = useState(EMPTY_STRING);
  const [saved, setSaved] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiReady, setAiReady] = useState(true);
  const [addLocaleOpen, setAddLocaleOpen] = useState(false);
  const [addLocaleValue, setAddLocaleValue] = useState(EMPTY_STRING);
  const [newKey, setNewKey] = useState(EMPTY_STRING);
  const [newSource, setNewSource] = useState(EMPTY_STRING);
  const [newPageTitle, setNewPageTitle] = useState(EMPTY_STRING);
  const seeded = seedIfEmpty(bag);
  const activePageId = scope === TRANSLATION_SCOPE.PAGE ? pageId : EMPTY_STRING;
  const rows = buildTranslationRows(seeded, locale, query, activePageId);
  const missing = countMissing(seeded, locale, activePageId);
  const done = countDone(seeded, locale, activePageId);
  const suggested = countSuggested(seeded, locale, activePageId);
  const jsonValue = jsonDraft || JSON.stringify(seeded, null, TRANSLATION_JSON_INDENT);
  const showPageTable = scope === TRANSLATION_SCOPE.PAGE && !pageId;
  const showBackToPages = Boolean(activePageId) || scope === TRANSLATION_SCOPE.GLOBAL;
  const localeNames: TranslationLocaleNames = {
    en: t.cmsTranslations.localeEn,
    fr: t.cmsTranslations.localeFr,
    es: t.cmsTranslations.localeEs,
    de: t.cmsTranslations.localeDe,
    ja: t.cmsTranslations.localeJa,
  };
  const language = localeLanguageName({ locale, names: localeNames });
  const bannerMessage = fillTemplate(t.settings.translationsAiBanner, {
    count: String(missing),
    language,
  });
  const placeholder = fillTemplate(t.settings.translationsTargetEmpty, { language });

  useEffect(() => {
    if (pageId) {
      setScope(TRANSLATION_SCOPE.PAGE);
    }
  }, [pageId]);

  useEffect(() => {
    if (!token) {
      return;
    }
    void loadCmsTranslationsRemote(token).then((remote) => {
      if (remote) {
        const next = seedIfEmpty(remote);
        setBag(next);
        saveCmsTranslationsLocal(next);
      }
    });
  }, [token]);

  const persist = async (next: CmsTranslations) => {
    setBag(next);
    setSaved(false);
    if (!token) {
      return;
    }
    const ok = await saveCmsTranslationsRemote(token, next);
    setSaved(ok);
  };

  const onJsonChange = (value: string) => {
    setJsonDraft(value);
    const parsed = parseTranslationsJson(value);
    if (parsed) {
      setBag(parsed);
      setSaved(false);
    }
  };

  const onSave = () => {
    const parsed = view === TRANSLATION_VIEW.JSON ? parseTranslationsJson(jsonValue) : seeded;
    if (!parsed) {
      return;
    }
    void persist(parsed);
  };

  const sourceMapForAi = (keys: string[]) => {
    const full = activePageId
      ? seeded.pages?.[activePageId]?.[TRANSLATION_SOURCE_LOCALE] || {}
      : seeded.locales[TRANSLATION_SOURCE_LOCALE] || TRANSLATION_SEED.locales.en;
    if (keys.length === NUMBER_ZERO) {
      return full;
    }
    const picked: Record<string, string> = {};
    keys.forEach((key) => {
      const value = full[key];
      if (value) {
        picked[key] = value;
      }
    });
    return picked;
  };

  const onPrepareAi = async (keys: string[] = []) => {
    setAiBusy(true);
    const sourceMap = sourceMapForAi(keys);
    const response = await useApi(
      `${INK_API_URL}${TRANSLATE_CATALOGS_PATH}`,
      {
        method: HTTP_METHOD_POST,
        headers: {
          ...(token ? authHeaders(token) : {}),
          [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
        },
        body: JSON.stringify({
          locales: [locale],
          source: sourceMap,
        }),
      },
      { silent: true, onError: () => undefined },
    );
    setAiBusy(false);
    if (response.status === HTTP_NOT_IMPLEMENTED || !response.ok) {
      setAiReady(false);
      return;
    }
    const catalogs = resolveTranslateCatalogs(await response.json());
    const catalog = catalogs[locale] || {};
    const next: CmsTranslations = {
      ...seeded,
      suggested: {
        ...seeded.suggested,
        [locale]: {
          ...(seeded.suggested[locale] || {}),
          ...catalog,
        },
      },
    };
    void persist(next);
    setAiReady(true);
  };

  const onAddLocale = () => {
    const code = addLocaleValue.trim().toLowerCase();
    setAddLocaleOpen(false);
    setAddLocaleValue(EMPTY_STRING);
    if (!isLocaleCode(code)) {
      return;
    }
    void persist(addLocaleToBag(seeded, code));
    setLocale(code);
  };

  const onAddString = () => {
    if (!isTranslationKey(newKey.trim())) {
      return;
    }
    const next = addKeyToBag({
      bag: seeded,
      key: newKey,
      value: newSource,
      pageId: activePageId,
    });
    setNewKey(EMPTY_STRING);
    setNewSource(EMPTY_STRING);
    void persist(next);
  };

  const onAddPage = async () => {
    const title = newPageTitle.trim();
    if (!title) {
      return;
    }
    const createdId = await onCreatePage(title);
    setNewPageTitle(EMPTY_STRING);
    if (!createdId) {
      return;
    }
    void persist(addPageToBag({ bag: seeded, pageId: createdId }));
    onOpenPage(createdId);
  };

  const onPageRowClick = (rowId: string) => {
    if (rowId === TRANSLATION_GLOBAL_ID) {
      setScope(TRANSLATION_SCOPE.GLOBAL);
      onOpenPage(EMPTY_STRING);
      return;
    }
    setScope(TRANSLATION_SCOPE.PAGE);
    onOpenPage(rowId);
  };

  const pageRows = [
    {
      id: TRANSLATION_GLOBAL_ID,
      title: t.cmsTranslations.scopeGlobal,
      keys: globalKeyCount(seeded),
    },
    ...pages,
  ];

  const onImportFile = (file: File) => {
    void file.text().then((raw) => {
      const parsed = parseTranslationsJson(raw);
      if (!parsed) {
        return;
      }
      void persist(parsed);
    });
  };

  const onExport = () => {
    downloadJsonFile({
      filename: TRANSLATION_EXPORT_NAME,
      body: JSON.stringify(seeded, null, TRANSLATION_JSON_INDENT),
      mime: CONTENT_TYPE_JSON,
    });
  };

  const showBanner = missing > NUMBER_ZERO && aiReady && !showPageTable;

  return (
    <Flex direction="column" gap={3} className="bifrost-cms-translations">
      <TranslationToolbar
        locales={listLocales(seeded)}
        sourceLocale={seeded.sourceLocale}
        activeLocale={locale}
        query={query}
        view={view}
        addLocaleOpen={addLocaleOpen}
        addLocaleValue={addLocaleValue}
        sourceLabel={t.settings.translationsSource}
        addLocaleLabel={t.settings.translationsAddLocale}
        searchLabel={t.settings.translationsSearch}
        importLabel={t.settings.translationsImport}
        exportLabel={t.settings.translationsExport}
        tableLabel={t.settings.translationsTable}
        jsonLabel={t.settings.translationsJson}
        onLocale={setLocale}
        onQuery={setQuery}
        onView={setView}
        onImportFile={onImportFile}
        onExport={onExport}
        onToggleAddLocale={() => setAddLocaleOpen(true)}
        onAddLocaleValue={setAddLocaleValue}
        onAddLocale={onAddLocale}
      />
      <Flex gap={2} wrap="wrap" align="center" className="bifrost-cms-translations__meta">
        <Button
          size="sm"
          variant={scope === TRANSLATION_SCOPE.GLOBAL ? 'ink' : 'ghost'}
          onClick={() => {
            setScope(TRANSLATION_SCOPE.GLOBAL);
            onOpenPage(EMPTY_STRING);
          }}
        >
          {t.cmsTranslations.scopeGlobal}
        </Button>
        <Button
          size="sm"
          variant={scope === TRANSLATION_SCOPE.PAGE && !pageId ? 'ink' : 'ghost'}
          onClick={() => {
            setScope(TRANSLATION_SCOPE.PAGE);
            onOpenPage(EMPTY_STRING);
          }}
        >
          {t.cmsTranslations.scopePages}
        </Button>
        {!showPageTable && (
          <Flex gap={3} wrap="wrap" align="center" className="bifrost-cms-translations__stats">
            <Typography variant="caption" className="mb-0">
              {rows.length} {t.settings.translationsKeys}
            </Typography>
            <Typography variant="caption" className="bifrost-cms-translations__stat bifrost-cms-translations__stat--done mb-0">
              {done} {t.settings.translationsDone}
            </Typography>
            <Typography variant="caption" className="bifrost-cms-translations__stat bifrost-cms-translations__stat--missing mb-0">
              {missing} {t.settings.translationsMissing}
            </Typography>
            <Typography variant="caption" className="bifrost-cms-translations__stat bifrost-cms-translations__stat--ai mb-0">
              {suggested} {t.settings.translationsSuggested}
            </Typography>
          </Flex>
        )}
      </Flex>
      {!aiReady && <Alert severity="info">{t.settings.translationsAiNotReady}</Alert>}
      {showBanner && (
        <TranslationAiBanner
          message={bannerMessage}
          actionLabel={aiBusy ? t.settings.translationsAiPrepare : t.settings.translationsAiAll}
          busy={aiBusy}
          onTranslateAll={() => void onPrepareAi()}
        />
      )}
      {showPageTable ? (
        <Flex direction="column" gap={2}>
          <TranslationAddPage
            titleValue={newPageTitle}
            titlePlaceholder={t.cmsTranslations.addPagePlaceholder}
            addLabel={t.cmsTranslations.addPage}
            onTitle={setNewPageTitle}
            onAdd={() => void onAddPage()}
          />
          <CmsGridTable
            data={pageRows}
            getRowId={(row) => row.id}
            onRowClick={(row) => onPageRowClick(String(row.id))}
            columns={[
              { id: TRANSLATION_PAGE_COL.TITLE, header: t.cmsTranslations.pageTitle, accessor: 'title' },
              { id: TRANSLATION_PAGE_COL.KEYS, header: t.cmsTranslations.pageKeys, accessor: 'keys' },
            ]}
            emptyContent={t.cmsTranslations.pagesEmpty}
          />
        </Flex>
      ) : (
        <Flex direction="column" gap={2}>
          {showBackToPages && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setScope(TRANSLATION_SCOPE.PAGE);
                onOpenPage(EMPTY_STRING);
              }}
            >
              {t.cmsTranslations.backToPages}
            </Button>
          )}
          <TranslationAddBar
            keyValue={newKey}
            sourceValue={newSource}
            keyPlaceholder={t.cmsTranslations.addKeyPlaceholder}
            valuePlaceholder={t.cmsTranslations.addValuePlaceholder}
            addLabel={t.cmsTranslations.addString}
            onKey={setNewKey}
            onValue={setNewSource}
            onAdd={onAddString}
          />
          {view === TRANSLATION_VIEW.TABLE ? (
            <TranslationTable
              rows={rows}
              keyHeader={t.settings.translationsColKey}
              sourceHeader={t.settings.translationsColSource}
              targetHeader={language.toUpperCase()}
              statusHeader={t.settings.translationsColStatus}
              placeholder={placeholder}
              acceptLabel={t.settings.translationsAccept}
              rejectLabel={t.settings.translationsReject}
              translateOneLabel={t.settings.translationsTranslateOne}
              doneLabel={t.settings.translationsStatusDone}
              missingLabel={t.settings.translationsStatusMissing}
              aiLabel={t.settings.translationsStatusAi}
              busy={aiBusy}
              onTarget={(key, value) => void persist(withLocaleTarget(seeded, locale, key, value, activePageId))}
              onAccept={(key) => void persist(acceptOneSuggested(seeded, locale, key, activePageId))}
              onReject={(key) => void persist(rejectSuggested(seeded, locale, key))}
              onTranslateOne={(key) => void onPrepareAi([key])}
            />
          ) : (
            <TranslationJsonPanel
              value={jsonValue}
              suggestedKeys={suggestedKeys(seeded, locale)}
              fillLabel={t.settings.translationsFillJson}
              busy={aiBusy}
              onChange={onJsonChange}
              onFill={() => void onPrepareAi()}
            />
          )}
        </Flex>
      )}
      <Flex gap={2} align="center">
        <Button size="sm" variant="primary" onClick={onSave}>
          {t.settings.catalogSave}
        </Button>
        {saved && <Typography variant="caption">{t.settings.translationsSaved}</Typography>}
      </Flex>
    </Flex>
  );
};
