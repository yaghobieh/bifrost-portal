import { useEffect, useState, type FC } from 'react';
import { Alert, Button, CodeEditor, Flex, Input, Typography } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { CONTENT_TYPE_JSON, EMPTY_STRING, HEADER_CONTENT_TYPE } from '@const/strings.const';
import { HTTP_METHOD_POST, HTTP_NOT_IMPLEMENTED } from '@const/http.const';
import { INK_API_URL } from '@const/billing.const';
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
import { SettingsSection } from '@pages/Cms/SettingsPages/components/SettingsSection';
import {
  TRANSLATION_COL,
  TRANSLATION_JSON_INDENT,
  TRANSLATION_LOCALES,
  TRANSLATION_PAGE_COL,
  TRANSLATION_SCOPE,
  TRANSLATION_SEED,
  TRANSLATION_SOURCE_LOCALE,
  TRANSLATION_STATUS,
  TRANSLATION_VIEW,
} from './TranslationsManager.const';
import type {
  TranslationLocale,
  TranslationRow,
  TranslationScopeId,
  TranslationViewId,
  TranslationsManagerProps,
} from './TranslationsManager.types';
import {
  acceptSuggested,
  buildTranslationRows,
  countDone,
  countMissing,
  countSuggested,
  emptyBag,
  parseTranslationsJson,
  seedIfEmpty,
  withLocaleTarget,
} from './TranslationsManager.utils';

export const TranslationsManager: FC<TranslationsManagerProps> = (props) => {
  const { pageId, onOpenPage, pages } = props;
  const { t } = useI18n();
  const { token } = useAuth();
  const [bag, setBag] = useState<CmsTranslations>(() => loadCmsTranslationsLocal() || emptyBag());
  const [locale, setLocale] = useState<TranslationLocale>(TRANSLATION_LOCALES[1]);
  const [view, setView] = useState<TranslationViewId>(TRANSLATION_VIEW.TABLE);
  const [scope, setScope] = useState<TranslationScopeId>(
    pageId ? TRANSLATION_SCOPE.PAGE : TRANSLATION_SCOPE.GLOBAL,
  );
  const [query, setQuery] = useState(EMPTY_STRING);
  const [jsonDraft, setJsonDraft] = useState(EMPTY_STRING);
  const [saved, setSaved] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiReady, setAiReady] = useState(true);
  const seeded = seedIfEmpty(bag);
  const activePageId = scope === TRANSLATION_SCOPE.PAGE ? pageId : EMPTY_STRING;
  const rows = buildTranslationRows(seeded, locale, query, activePageId);
  const missing = countMissing(seeded, locale, activePageId);
  const done = countDone(seeded, locale, activePageId);
  const suggested = countSuggested(seeded, locale, activePageId);
  const jsonValue = jsonDraft || JSON.stringify(seeded, null, TRANSLATION_JSON_INDENT);
  const showPageTable = scope === TRANSLATION_SCOPE.PAGE && !pageId;

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

  const onCellEdit = (rowId: string | number, columnId: string, newValue: unknown) => {
    if (columnId !== TRANSLATION_COL.TARGET) {
      return;
    }
    const value = String(newValue ?? EMPTY_STRING);
    void persist(withLocaleTarget(seeded, locale, String(rowId), value, activePageId));
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

  const onPrepareAi = async () => {
    setAiBusy(true);
    const sourceMap = activePageId
      ? seeded.pages?.[activePageId]?.[TRANSLATION_SOURCE_LOCALE] || {}
      : seeded.locales[TRANSLATION_SOURCE_LOCALE] || TRANSLATION_SEED.locales.en;
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
    const data = (await response.json()) as { catalogs?: Record<string, Record<string, string>> };
    const catalog = data.catalogs?.[locale] || {};
    const next: CmsTranslations = {
      ...seeded,
      suggested: {
        ...seeded.suggested,
        [locale]: catalog,
      },
    };
    void persist(next);
    setAiReady(true);
  };

  const statusLabel = (status: TranslationRow['status']): string => {
    if (status === TRANSLATION_STATUS.DONE) {
      return t.settings.translationsStatusDone;
    }
    if (status === TRANSLATION_STATUS.AI) {
      return t.settings.translationsStatusAi;
    }
    return t.settings.translationsStatusMissing;
  };

  return (
    <div className="bifrost-cms-settings-box bifrost-cms-translations">
      <Flex direction="column" gap={3}>
        <SettingsSection title={t.cmsTranslations.title} description={t.cmsTranslations.subtitle}>
          <Flex gap={2} wrap="wrap" align="center">
            <Button
              size="sm"
              variant={scope === TRANSLATION_SCOPE.GLOBAL ? 'ink' : 'outline'}
              onClick={() => setScope(TRANSLATION_SCOPE.GLOBAL)}
            >
              {t.cmsTranslations.scopeGlobal}
            </Button>
            <Button
              size="sm"
              variant={scope === TRANSLATION_SCOPE.PAGE ? 'ink' : 'outline'}
              onClick={() => setScope(TRANSLATION_SCOPE.PAGE)}
            >
              {t.cmsTranslations.scopePages}
            </Button>
            {TRANSLATION_LOCALES.map((code) => (
              <Button
                key={code}
                size="sm"
                variant={locale === code ? 'ink' : 'outline'}
                onClick={() => setLocale(code)}
              >
                {code.toUpperCase()}
                {code === seeded.sourceLocale ? ` · ${t.settings.translationsSource}` : EMPTY_STRING}
              </Button>
            ))}
            <Input
              label={t.settings.translationsSearch}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button
              size="sm"
              variant={view === TRANSLATION_VIEW.TABLE ? 'ink' : 'outline'}
              onClick={() => setView(TRANSLATION_VIEW.TABLE)}
            >
              {t.settings.translationsTable}
            </Button>
            <Button
              size="sm"
              variant={view === TRANSLATION_VIEW.JSON ? 'ink' : 'outline'}
              onClick={() => setView(TRANSLATION_VIEW.JSON)}
            >
              {t.settings.translationsJson}
            </Button>
            <Button size="sm" variant="primary" disabled={aiBusy} onClick={() => void onPrepareAi()}>
              {aiBusy ? t.settings.translationsAiPrepare : t.settings.translationsAiAll}
            </Button>
          </Flex>
          {showPageTable ? (
            <CmsGridTable
              data={pages}
              getRowId={(row) => row.id}
              onRowClick={(row) => onOpenPage(String(row.id))}
              columns={[
                { id: TRANSLATION_PAGE_COL.TITLE, header: t.cmsTranslations.pageTitle, accessor: 'title' },
                { id: TRANSLATION_PAGE_COL.KEYS, header: t.cmsTranslations.pageKeys, accessor: 'keys' },
              ]}
              emptyContent={t.cmsTranslations.pagesEmpty}
            />
          ) : (
            <>
              {activePageId && (
                <Button size="sm" variant="ghost" onClick={() => onOpenPage(EMPTY_STRING)}>
                  {t.cmsTranslations.backToPages}
                </Button>
              )}
              <Flex gap={3} wrap="wrap">
                <Typography variant="caption">
                  {rows.length} {t.settings.translationsKeys}
                </Typography>
                <Typography variant="caption">
                  {done} {t.settings.translationsDone}
                </Typography>
                <Typography variant="caption">
                  {missing} {t.settings.translationsMissing}
                </Typography>
                <Typography variant="caption">
                  {suggested} {t.settings.translationsSuggested}
                </Typography>
              </Flex>
              {!aiReady && <Alert severity="info">{t.settings.translationsAiNotReady}</Alert>}
              {missing > 0 && aiReady && (
                <Alert severity="info">
                  {t.settings.translationsAiBanner.replace('{count}', String(missing))}
                </Alert>
              )}
              {view === TRANSLATION_VIEW.TABLE ? (
                <CmsGridTable
                  data={rows}
                  getRowId={(row) => row.id}
                  enableCellEdit
                  onCellEdit={onCellEdit}
                  columns={[
                    { id: TRANSLATION_COL.KEY, header: t.settings.translationsColKey, accessor: 'key' },
                    { id: TRANSLATION_COL.SOURCE, header: t.settings.translationsColSource, accessor: 'source' },
                    {
                      id: TRANSLATION_COL.TARGET,
                      header: t.settings.translationsColTarget,
                      accessor: 'target',
                      editable: true,
                    },
                    {
                      id: TRANSLATION_COL.STATUS,
                      header: t.settings.translationsColStatus,
                      accessor: 'status',
                      render: (value) => statusLabel(value as TranslationRow['status']),
                    },
                  ]}
                />
              ) : (
                <CodeEditor
                  value={jsonValue}
                  onChange={onJsonChange}
                  language="json"
                  theme="dark"
                  showLineNumbers
                  showGutter
                  highlightActiveLine
                />
              )}
              {suggested > 0 && (
                <Button size="sm" variant="outline" onClick={() => void persist(acceptSuggested(seeded, locale))}>
                  {t.settings.translationsAccept}
                </Button>
              )}
            </>
          )}
        </SettingsSection>
        <Flex gap={2} align="center">
          <Button size="sm" variant="primary" onClick={onSave}>
            {t.settings.catalogSave}
          </Button>
          {saved && <Typography variant="caption">{t.settings.translationsSaved}</Typography>}
        </Flex>
      </Flex>
    </div>
  );
};
