import { useEffect, useState, type ChangeEvent, type DragEvent, type FC } from 'react';
import { useNavigate, useParams } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import {
  Alert,
  Badge,
  BearIcons,
  Button,
  Card,
  DatePicker,
  Drawer,
  Flex,
  Input,
  MultiSelect,
  Spinner,
  TimePicker,
  Typography,
} from '@forgedevstack/bear';
import { InkEditor } from '@forgedevstack/ink';
import { cmsInkAiProps } from '@/ai/index';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING, ROUTES, cmsBlogEditPath, cmsBuilderPath, CMS_EDIT_SIDE_MAX_PX, CMS_EDIT_SIDE_MIN_PX, CMS_EDIT_SIDE_WIDTH_KEY, CMS_EDIT_SIDE_WIDTH_PX, DRAG_WIDGET_MIME } from '@const/index';
import { CMS_ICON_SIZE, NUMBER_FOUR_HUNDRED_TWENTY, NUMBER_THREE_HUNDRED_TWENTY, NUMBER_ZERO } from '@const/numbers.const';
import { joinTags, splitTags, tagSelectOptions } from '@utils';
import { authNucleus, contentNucleus } from '@sdk/index';
import type { ContentStatus } from '@sdk/modules/content';
import { CmsShell, CMS_NAV_IDS, CMS_CARD_PADDING, LiveEditors, CmsPageHeader } from '../CmsShell';
import { useCmsLive } from '../CmsShell/CmsLiveProvider';
import { currentLiveLocation } from '../CmsShell/CmsLive.utils';
import { isPageSubmitLocked, locationOwner } from '../CmsShell/helpers/LiveEditors';
import { loadStoredWidth, saveStoredWidth, startHorizontalResize } from '../CmsShell/CmsShell.utils';
import {
  BEAR_WIDGET_CATALOG,
  BEAR_WIDGET_ID_TRANSLATION,
  CONTENT_EDIT_AUTHOR_ID,
  CONTENT_EDIT_CATEGORIES_ID,
  CONTENT_EDIT_FEATURED_ID,
  CONTENT_EDIT_KIND,
  CONTENT_EDIT_OG_DESC_ID,
  CONTENT_EDIT_OG_IMAGE_ID,
  CONTENT_EDIT_OG_TITLE_ID,
  CONTENT_EDIT_REVISION_LIMIT,
  CONTENT_EDIT_SCHEDULE_DATE_ID,
  CONTENT_EDIT_SEO_DESC_ID,
  CONTENT_EDIT_SEO_KEYWORD_ID,
  CONTENT_EDIT_SEO_TITLE_ID,
  CONTENT_EDIT_SLUG_ID,
  CONTENT_EDIT_STATUS_ORDER,
  CONTENT_EDIT_SUBTITLE_ID,
  CONTENT_EDIT_TAGS_ID,
  CONTENT_EDIT_TITLE_ID,
  PAYLOAD_KEY_AUTHOR,
  PAYLOAD_KEY_CAST_FIELDS,
  PAYLOAD_KEY_CAST_VALUES,
  PAYLOAD_KEY_CATEGORIES,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_FEATURED,
  PAYLOAD_KEY_FIELD_ORDER,
  PAYLOAD_KEY_LAYOUT,
  PAYLOAD_KEY_OG_DESCRIPTION,
  PAYLOAD_KEY_OG_IMAGE,
  PAYLOAD_KEY_OG_TITLE,
  PAYLOAD_KEY_SCHEDULE,
  PAYLOAD_KEY_SEO_DESCRIPTION,
  PAYLOAD_KEY_SEO_KEYWORD,
  PAYLOAD_KEY_SEO_TITLE,
  PAYLOAD_KEY_SUBTITLE,
  PAYLOAD_KEY_TAGS,
  PAYLOAD_KEY_TEMPLATE,
  PAYLOAD_KEY_UPDATED_BY,
  PAYLOAD_LEAD_KEY,
} from './ContentEdit.const';
import {
  appendWidgetHtml,
  joinScheduleAt,
  loadPublicEditTarget,
  loadSeoCollapsed,
  nowScheduleAt,
  payloadString,
  resolveEditBodyHtml,
  resolveEditTarget,
  saveSeoCollapsed,
  splitScheduleAt,
} from './ContentEdit.utils';
import { CastPageFields } from './helpers/CastPageFields';
import { ContentFieldStage } from './helpers/ContentFieldStage';
import { dropIndexFromEvent } from './helpers/ContentFieldStage/ContentFieldStage.utils';
import { ContentTranslationWidget } from './helpers/ContentTranslationWidget';
import type { TranslationApplyParams } from './helpers/ContentTranslationWidget';
import { createCastField, createNamedCastField } from '@pages/Cms/CastPages/CastPages.utils';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import { buildDocsCastFields, docsCastValues, isDocsLayout } from '@pages/Cms/ContentPages/ContentPages.utils';
import { TRANSLATION_CONTENT_COLLECTIONS } from '@pages/Cms/TranslationsPages/TranslationsPages.const';
import type { BearWidgetDef, ContentEditTarget } from './ContentEdit.types';
import {
  CAST_VALUE_SUMMARY_JOIN,
  CAST_VALUE_SUMMARY_SEP,
} from './helpers/CastPageFields';
import {
  castFieldsFromPayload,
  castValuesFromPayload,
  fieldOrderKeys,
  findLinkedTemplate,
  insertCastFieldAt,
  mergeCastFields,
  moveCastFields,
  orderCastFields,
  pageOwnedCastFields,
  summarizeCastValues,
} from './castFields.utils';
import type { CastField } from '../CastPages/CastPages.types';
import {
  CONTENT_COLLECTION_PAGE_META,
  CONTENT_COLLECTION_PAGES,
  DOCUMENT_TEMPLATE_ID,
} from '../ContentPages/ContentPages.const';
import { BLOG_COLLECTION } from '../BlogPages/BlogPages.const';
import { loadCmsProfile } from '../SettingsPages';

type ContentRevision = {
  id: string;
  title: string;
  bodyHtml: string;
  status: ContentStatus;
  savedAt: string;
};

export const ContentEdit: FC = () => {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { onlineUsers, selfId, selfSessionId } = useCmsLive();
  const { token } = useNucleus(authNucleus);
  const {
    items,
    pages,
    loading,
    saving,
    error,
    fetchContent,
    fetchPages,
    saveContent,
    updatePage,
  } = useNucleus(contentNucleus);
  const activeToken = token || providerToken;
  const id = params.id || EMPTY_STRING;

  const [title, setTitle] = useState(EMPTY_STRING);
  const [subtitle, setSubtitle] = useState(EMPTY_STRING);
  const [slug, setSlug] = useState(EMPTY_STRING);
  const [author, setAuthor] = useState(EMPTY_STRING);
  const [tags, setTags] = useState(EMPTY_STRING);
  const [categories, setCategories] = useState(EMPTY_STRING);
  const [featuredImage, setFeaturedImage] = useState(EMPTY_STRING);
  const [bodyHtml, setBodyHtml] = useState(EMPTY_STRING);
  const [status, setStatus] = useState<ContentStatus>('published');
  const [seoTitle, setSeoTitle] = useState(EMPTY_STRING);
  const [seoDescription, setSeoDescription] = useState(EMPTY_STRING);
  const [seoKeyword, setSeoKeyword] = useState(EMPTY_STRING);
  const [ogTitle, setOgTitle] = useState(EMPTY_STRING);
  const [ogDescription, setOgDescription] = useState(EMPTY_STRING);
  const [ogImage, setOgImage] = useState(EMPTY_STRING);
  const [scheduleAt, setScheduleAt] = useState(nowScheduleAt);
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [preview, setPreview] = useState(false);
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [translationOpen, setTranslationOpen] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [seoCollapsed, setSeoCollapsed] = useState(() => loadSeoCollapsed());
  const [sideWidth, setSideWidth] = useState(() =>
    loadStoredWidth(
      CMS_EDIT_SIDE_WIDTH_KEY,
      CMS_EDIT_SIDE_WIDTH_PX,
      CMS_EDIT_SIDE_MIN_PX,
      CMS_EDIT_SIDE_MAX_PX,
    ),
  );
  const [previewWidth, setPreviewWidth] = useState(0);
  const [pageFields, setPageFields] = useState<CastField[]>([]);
  const [fieldOrder, setFieldOrder] = useState<string[]>([]);
  const [castValues, setCastValues] = useState<Record<string, string>>({});
  const [publicTarget, setPublicTarget] = useState<ContentEditTarget | null>(null);
  const [publicLoading, setPublicLoading] = useState(false);

  useEffect(() => {
    if (!activeToken) return;
    void fetchContent(activeToken);
    void fetchPages(activeToken);
  }, [activeToken, fetchContent, fetchPages]);

  const cmsTarget = id ? resolveEditTarget(id, pages, items) : null;
  const target = cmsTarget || publicTarget;
  const liveLocation = currentLiveLocation().location;
  const pageLocked = isPageSubmitLocked({
    users: onlineUsers,
    currentUserId: selfId,
    location: liveLocation,
  });
  const pageOwner = locationOwner({ users: onlineUsers, location: liveLocation });

  useEffect(() => {
    if (!id) {
      setPublicTarget(null);
      setPublicLoading(false);
      return;
    }
    if (cmsTarget) {
      setPublicTarget(null);
      setPublicLoading(false);
      return;
    }
    if (loading) {
      return;
    }
    let cancelled = false;
    setPublicLoading(true);
    void loadPublicEditTarget(id)
      .then((next) => {
        if (cancelled) {
          return;
        }
        setPublicTarget(next);
        setPublicLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setPublicTarget(null);
        setPublicLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, cmsTarget?.id, loading]);

  useEffect(() => {
    if (!target) {
      setHydrated(false);
      return;
    }
    setTitle(target.title);
    setSlug(target.slug);
    setBodyHtml(target.bodyHtml);
    setStatus((target.status as ContentStatus) || 'draft');
    setSubtitle(payloadString(target.payload, PAYLOAD_KEY_SUBTITLE, PAYLOAD_LEAD_KEY));
    setAuthor(payloadString(target.payload, PAYLOAD_KEY_AUTHOR) || loadCmsProfile().displayName);
    setTags(payloadString(target.payload, PAYLOAD_KEY_TAGS));
    setCategories(payloadString(target.payload, PAYLOAD_KEY_CATEGORIES));
    setFeaturedImage(
      payloadString(target.payload, PAYLOAD_KEY_FEATURED) || target.mediaUrl || EMPTY_STRING,
    );
    setSeoTitle(payloadString(target.payload, PAYLOAD_KEY_SEO_TITLE) || target.title);
    setSeoDescription(payloadString(target.payload, PAYLOAD_KEY_SEO_DESCRIPTION));
    setSeoKeyword(payloadString(target.payload, PAYLOAD_KEY_SEO_KEYWORD));
    setOgTitle(payloadString(target.payload, PAYLOAD_KEY_OG_TITLE));
    setOgDescription(payloadString(target.payload, PAYLOAD_KEY_OG_DESCRIPTION));
    setOgImage(payloadString(target.payload, PAYLOAD_KEY_OG_IMAGE));
    setScheduleAt(payloadString(target.payload, PAYLOAD_KEY_SCHEDULE) || nowScheduleAt());
    const templateItem = findLinkedTemplate(items, target.payload, target.id);
    const templateFields = castFieldsFromPayload(templateItem?.payload);
    const ownedFields = pageOwnedCastFields(castFieldsFromPayload(target.payload), templateFields);
    const layoutId = payloadString(target.payload, PAYLOAD_KEY_LAYOUT);
    const seededFields =
      ownedFields.length > NUMBER_ZERO || !isDocsLayout(layoutId)
        ? ownedFields
        : buildDocsCastFields();
    const loadedValues = castValuesFromPayload(target.payload);
    const seededValues =
      Object.keys(loadedValues).length > NUMBER_ZERO || !isDocsLayout(layoutId)
        ? loadedValues
        : docsCastValues();
    setPageFields(seededFields);
    setCastValues(seededValues);
    const orderRaw = target.payload?.[PAYLOAD_KEY_FIELD_ORDER];
    if (Array.isArray(orderRaw)) {
      setFieldOrder(orderRaw.filter((entry): entry is string => typeof entry === 'string'));
    } else {
      setFieldOrder([]);
    }
    setRevisions([]);
    setSaveOk(false);
    setHydrated(true);
  }, [target?.id, target?.kind, target?.bodyHtml, target?.title, target?.status, items]);

  useEffect(() => {
    if (target?.collection === BLOG_COLLECTION) {
      navigate(cmsBlogEditPath(target.id));
    }
  }, [navigate, target?.collection, target?.id]);

  const pushRevision = () => {
    const revision: ContentRevision = {
      id: `rev-${Date.now()}`,
      title,
      bodyHtml,
      status,
      savedAt: new Date().toISOString(),
    };
    setRevisions((current) => [revision, ...current].slice(0, CONTENT_EDIT_REVISION_LIMIT));
  };

  const restoreRevision = (revision: ContentRevision) => {
    setTitle(revision.title);
    setBodyHtml(revision.bodyHtml);
    setStatus(revision.status);
    setSaveOk(false);
  };

  const markUnsaved = () => setSaveOk(false);

  const insertWidget = (widget: BearWidgetDef) => {
    if (widget.id === BEAR_WIDGET_ID_TRANSLATION) {
      setTranslationOpen(true);
      setWidgetsOpen(false);
      return;
    }
    const field = createNamedCastField({
      id: `w-${widget.id}-${Date.now()}`,
      name: `widget_${widget.id}_${Date.now()}`,
      label: widget.label,
      type: CAST_FIELD_TYPE.TEXTAREA,
    });
    setPageFields((current) => [...current, field]);
    setFieldOrder((current) => [...current, field.name]);
    setCastValues((current) => ({ ...current, [field.name]: widget.html }));
    setBodyHtml((current) => appendWidgetHtml(current, widget.html));
    setSaveOk(false);
  };

  const onDragStart = (event: DragEvent<HTMLButtonElement>, widgetId: string) => {
    event.dataTransfer.setData(DRAG_WIDGET_MIME, widgetId);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const onEditorDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const widgetId = event.dataTransfer.getData(DRAG_WIDGET_MIME);
    const widget = BEAR_WIDGET_CATALOG.find((entry) => entry.id === widgetId);
    if (widget) {
      insertWidget(widget);
    }
  };

  const onStageDrop = (index: number, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const from = dropIndexFromEvent(event);
    if (from !== null) {
      const next = moveCastFields(displayFields, from, index);
      setPageFields(pageOwnedCastFields(next, templateFields));
      setFieldOrder(fieldOrderKeys(next));
      setSaveOk(false);
      return;
    }
    const widgetId = event.dataTransfer.getData(DRAG_WIDGET_MIME);
    const widget = BEAR_WIDGET_CATALOG.find((entry) => entry.id === widgetId);
    if (!widget) {
      return;
    }
    if (widget.id === BEAR_WIDGET_ID_TRANSLATION) {
      setTranslationOpen(true);
      return;
    }
    const field = createNamedCastField({
      id: `w-${widget.id}-${Date.now()}`,
      name: `widget_${widget.id}_${Date.now()}`,
      label: widget.label,
      type: CAST_FIELD_TYPE.TEXTAREA,
    });
    const next = insertCastFieldAt(displayFields, index, field);
    setPageFields(pageOwnedCastFields(next, templateFields));
    setFieldOrder(fieldOrderKeys(next));
    setCastValues((current) => ({ ...current, [field.name]: widget.html }));
    setSaveOk(false);
  };

  const onStringInput =
    (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      markUnsaved();
    };

  const onStatusSelect = (value: ContentStatus) => {
    setStatus(value);
    markUnsaved();
  };

  const onToggleSeoCollapsed = () => {
    const next = !seoCollapsed;
    setSeoCollapsed(next);
    saveSeoCollapsed(next);
  };

  const seoChevron = () => {
    if (seoCollapsed) {
      return <BearIcons.ChevronRightIcon size={CMS_ICON_SIZE} />;
    }
    return <BearIcons.ChevronDownIcon size={CMS_ICON_SIZE} />;
  };

  const templateItem = findLinkedTemplate(items, target?.payload, target?.id);
  const templateFields = castFieldsFromPayload(templateItem?.payload);
  const displayFields = orderCastFields(
    mergeCastFields(templateFields, pageFields),
    fieldOrder,
  );
  const lockedFieldIds = templateFields.map((field) => field.id);
  const existingTemplate =
    target?.payload && typeof target.payload[PAYLOAD_KEY_TEMPLATE] === 'string'
      ? String(target.payload[PAYLOAD_KEY_TEMPLATE])
      : templateItem?.id || EMPTY_STRING;
  const existingLayout =
    target?.payload && typeof target.payload[PAYLOAD_KEY_LAYOUT] === 'string'
      ? String(target.payload[PAYLOAD_KEY_LAYOUT])
      : EMPTY_STRING;
  const tagValues = splitTags(tags);
  const tagOptions = tagSelectOptions(tagValues);

  const onFieldChange = (id: string, patch: Partial<CastField>) => {
    setPageFields((current) =>
      current.map((field) => {
        if (field.id !== id) return field;
        const next = { ...field, ...patch };
        if (patch.name && patch.name !== field.name) {
          setCastValues((values) => {
            const nextValues = { ...values };
            if (field.name && field.name in nextValues) {
              nextValues[next.name] = nextValues[field.name];
              delete nextValues[field.name];
            }
            return nextValues;
          });
        }
        return next;
      }),
    );
    setSaveOk(false);
  };

  const onSave = async () => {
    if (!activeToken || !target) return;
    if (pageLocked) return;
    setSaveOk(false);
    pushRevision();
    const nextBody = resolveEditBodyHtml({
      layoutId: existingLayout,
      values: castValues,
      fieldCount: displayFields.length,
      fallback: bodyHtml,
    });
    setBodyHtml(nextBody);
    const extras = {
      [PAYLOAD_KEY_SUBTITLE]: subtitle,
      [PAYLOAD_KEY_SEO_TITLE]: seoTitle,
      [PAYLOAD_KEY_SEO_DESCRIPTION]: seoDescription,
      [PAYLOAD_KEY_SEO_KEYWORD]: seoKeyword,
      [PAYLOAD_KEY_OG_TITLE]: ogTitle,
      [PAYLOAD_KEY_OG_DESCRIPTION]: ogDescription,
      [PAYLOAD_KEY_OG_IMAGE]: ogImage,
      [PAYLOAD_KEY_TAGS]: tags,
      [PAYLOAD_KEY_CATEGORIES]: categories,
      [PAYLOAD_KEY_AUTHOR]: author,
      [PAYLOAD_KEY_SCHEDULE]: scheduleAt || null,
      [PAYLOAD_KEY_FEATURED]: featuredImage,
      [PAYLOAD_KEY_CAST_FIELDS]: pageFields,
      [PAYLOAD_KEY_CAST_VALUES]: castValues,
      [PAYLOAD_KEY_FIELD_ORDER]: fieldOrderKeys(displayFields),
      [PAYLOAD_KEY_TEMPLATE]: existingTemplate || undefined,
      [PAYLOAD_KEY_LAYOUT]: existingLayout || undefined,
      [PAYLOAD_KEY_CREATED_BY]:
        payloadString(target.payload, PAYLOAD_KEY_CREATED_BY) || loadCmsProfile().displayName,
      [PAYLOAD_KEY_UPDATED_BY]: loadCmsProfile().displayName || loadCmsProfile().username,
      [PAYLOAD_LEAD_KEY]: subtitle,
    };
    if (target.kind === CONTENT_EDIT_KIND.PAGE) {
      const okPage = await updatePage(activeToken, {
        id: target.id,
        title,
        bodyHtml: nextBody,
        status,
        mediaUrl: featuredImage || target.mediaUrl,
      });
      const okMeta = await saveContent(activeToken, {
        collection: CONTENT_COLLECTION_PAGE_META,
        slug: target.id,
        locale: target.locale || 'en',
        title,
        payload: extras,
        status,
      });
      const contentPage = items.find(
        (entry) =>
          entry.collection === CONTENT_COLLECTION_PAGES &&
          (entry.id === target.id || entry.slug === target.slug),
      );
      const okItem = contentPage
        ? Boolean(
            await saveContent(activeToken, {
              collection: CONTENT_COLLECTION_PAGES,
              slug: contentPage.slug,
              locale: contentPage.locale || target.locale || 'en',
              title,
              payload: {
                ...contentPage.payload,
                ...extras,
                html: nextBody,
              },
              status,
            }),
          )
        : true;
      setSaveOk(okPage && Boolean(okMeta) && okItem);
      return;
    }
    const payload = {
      ...(target.payload || {}),
      html: nextBody,
      blocks: [{ type: 'html', html: nextBody }],
      ...extras,
      [PAYLOAD_KEY_TEMPLATE]: existingTemplate || DOCUMENT_TEMPLATE_ID,
    };
    const ok = await saveContent(activeToken, {
      collection: target.collection || EMPTY_STRING,
      slug,
      locale: target.locale || 'en',
      title,
      payload,
      status,
    });
    setSaveOk(ok);
  };

  const translationItems = items.filter((item) =>
    TRANSLATION_CONTENT_COLLECTIONS.includes(item.collection),
  );

  const onApplyTranslation = (params: TranslationApplyParams) => {
    const { key, source } = params;
    setPageFields((current) => {
      const exists = current.some((field) => field.name === key);
      if (exists) {
        return current;
      }
      return [
        ...current,
        createNamedCastField({
          id: `t-${key}`,
          name: key,
          label: key,
          type: CAST_FIELD_TYPE.TEXT,
        }),
      ];
    });
    setCastValues((current) => ({ ...current, [key]: source }));
    setSaveOk(false);
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.PAGES}>
      <Flex direction="column" gap={4} className="bifrost-cms-edit">
        <CmsPageHeader
          title={title || t.contentEdit.title}
          subtitle={t.dashboard.contentSubtitle}
          actionTitle={t.dashboard.save}
          actionBody={t.dashboard.contentSubtitle}
          actions={
            <>
              <LiveEditors
                users={onlineUsers}
                currentUserId={selfId}
                currentSessionId={selfSessionId}
                location={currentLiveLocation().location}
              />
              {target && (
                <Badge variant="info" className="text-xs">
                  {target.slug}
                </Badge>
              )}
            </>
          }
          extra={
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(ROUTES.CMS_CONTENT)}
              >
                {t.contentEdit.backToContent}
              </Button>
              <Button
                size="sm"
                variant={widgetsOpen ? 'ink' : 'outline'}
                onClick={() => setWidgetsOpen(true)}
              >
                {t.contentEdit.widgetsOpen}
              </Button>
              <Button
                size="sm"
                variant={preview ? 'ink' : 'outline'}
                onClick={() => setPreview((value) => !value)}
              >
                {preview ? t.contentEdit.editMode : t.contentEdit.preview}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (target) navigate(cmsBuilderPath({ doc: target.id }));
                }}
                disabled={!target}
              >
                {t.contentEdit.openStage}
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<BearIcons.SaveIcon size={CMS_ICON_SIZE} />}
                onClick={() => void onSave()}
                disabled={!target || saving || pageLocked}
              >
                {saving ? t.dashboard.saving : t.dashboard.save}
              </Button>
            </>
          }
        />

        {pageLocked && pageOwner && (
          <Alert severity="warning">
            {t.cmsShell.pageLocked.replace('{name}', pageOwner.name)}
          </Alert>
        )}

        {(loading || publicLoading) && !hydrated ? (
          <Flex align="center" gap={2}>
            <Spinner size="sm" />
            <Typography variant="body2" className="mb-0">
              {t.contentEdit.loading}
            </Typography>
          </Flex>
        ) : null}

        {error ? (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.contentEdit.loadError}
          </Typography>
        ) : null}

        {!loading && !publicLoading && !target && id ? (
          <Typography variant="body2" className="bifrost-cms__muted mb-0">
            {t.contentEdit.notFound}
          </Typography>
        ) : null}

        {target ? (
          <div
            className="bifrost-cms-edit__layout"
            style={{
              gridTemplateColumns: `minmax(0, 1fr) ${sideWidth}px`,
            }}
          >
            <Card className="bifrost-cms-edit__main" padding={CMS_CARD_PADDING}>
              <Flex direction="column" gap={3}>
                <Input
                  id={CONTENT_EDIT_TITLE_ID}
                  className="bifrost-cms-edit__title"
                  label={t.contentEdit.titleField}
                  value={title}
                  onChange={onStringInput(setTitle)}
                />
                <Input
                  id={CONTENT_EDIT_SUBTITLE_ID}
                  label={t.contentEdit.subtitle}
                  value={subtitle}
                  onChange={onStringInput(setSubtitle)}
                />
                {preview && (
                  <div
                    className="bifrost-cms-preview-shell"
                    style={
                      previewWidth
                        ? { width: `${previewWidth}px` }
                        : undefined
                    }
                  >
                    <iframe
                      className="bifrost-cms-preview-frame"
                      title={t.contentEdit.preview}
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;font-family:Inter,system-ui,sans-serif;padding:24px;color:#12141a;}</style></head><body>${bodyHtml}</body></html>`}
                    />
                    <button
                      type="button"
                      className="bifrost-cms-preview-resize"
                      aria-label={t.cmsBuilder.viewportLabel}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        const startX = event.clientX;
                        const startWidth = previewWidth || event.currentTarget.parentElement?.clientWidth || NUMBER_THREE_HUNDRED_TWENTY;
                        const onMove = (moveEvent: globalThis.MouseEvent) => {
                          setPreviewWidth(Math.max(NUMBER_THREE_HUNDRED_TWENTY, startWidth + moveEvent.clientX - startX));
                        };
                        const onUp = () => {
                          window.removeEventListener('mousemove', onMove);
                          window.removeEventListener('mouseup', onUp);
                        };
                        window.addEventListener('mousemove', onMove);
                        window.addEventListener('mouseup', onUp);
                      }}
                    />
                  </div>
                )}
                {!preview && (
                  <Flex
                    direction="column"
                    gap={3}
                    className="bifrost-cms-editor-stage ink-theme-snow"
                  >
                    {translationOpen && (
                      <ContentTranslationWidget
                        items={translationItems}
                        onApply={onApplyTranslation}
                      />
                    )}
                    <ContentFieldStage
                      fields={displayFields}
                      values={castValues}
                      onValueChange={(name, value) => {
                        setCastValues((current) => ({ ...current, [name]: value }));
                        setSaveOk(false);
                      }}
                      onDropAt={onStageDrop}
                      attachLabel={t.contentEdit.attachTranslation}
                      hideLabel={t.contentEdit.hideForRole}
                      reorderLabel={t.contentEdit.reorderHandle}
                      roleLabels={{
                        default: t.contentEdit.roleDefault,
                        editor: t.contentEdit.roleEditor,
                        manager: t.contentEdit.roleManager,
                        captain: t.contentEdit.roleCaptain,
                      }}
                      onAttach={() => {
                        setTranslationOpen(true);
                      }}
                      onHideRole={() => {
                        setSaveOk(false);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPageFields((current) => [...current, createCastField()]);
                        setSaveOk(false);
                      }}
                    >
                      {t.contentEdit.castAddField}
                    </Button>
                    <div
                      className="bifrost-cms-ink-block"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={onEditorDrop}
                    >
                      <Typography variant="caption">
                        {t.contentEdit.inkBlock}
                      </Typography>
                      <InkEditor
                        value={bodyHtml}
                        onChange={(next) => {
                          setBodyHtml(next);
                          setSaveOk(false);
                        }}
                        colorMode="light"
                        variant="document"
                        minHeight={NUMBER_FOUR_HUNDRED_TWENTY}
                        features={{ blocks: true, slash: true, table: true, ai: true }}
                        ai={cmsInkAiProps()}
                      />
                    </div>
                  </Flex>
                )}
                {saveOk && (
                  <Typography variant="caption">
                    {t.dashboard.saved}
                  </Typography>
                )}
                {preview && displayFields.length > NUMBER_ZERO && (
                  <Flex direction="column" gap={1}>
                    <Typography variant="h5" className="mb-0">
                      {t.contentEdit.castPreviewTitle}
                    </Typography>
                    <Typography variant="caption" className="bifrost-cms__muted mb-0">
                      {summarizeCastValues(
                        displayFields,
                        castValues,
                        CAST_VALUE_SUMMARY_JOIN,
                        CAST_VALUE_SUMMARY_SEP,
                      ) || t.contentEdit.castEmpty}
                    </Typography>
                  </Flex>
                )}
              </Flex>
            </Card>

            <div className="bifrost-cms-builder__pane bifrost-cms-builder__pane--inspector">
            <button
              type="button"
              className="bifrost-cms-panel-resize"
              aria-label={t.contentEdit.castFieldsTitle}
              onMouseDown={(event) => {
                event.preventDefault();
                startHorizontalResize(
                  event.clientX,
                  sideWidth,
                  CMS_EDIT_SIDE_MIN_PX,
                  CMS_EDIT_SIDE_MAX_PX,
                  true,
                  setSideWidth,
                  (width) => {
                    setSideWidth(width);
                    saveStoredWidth(CMS_EDIT_SIDE_WIDTH_KEY, width);
                  },
                );
              }}
            />
            <aside className="bifrost-cms-edit__side">
              <Card className="mb-3" padding={CMS_CARD_PADDING}>
                <button
                  type="button"
                  className="bifrost-cms-edit__seo-toggle"
                  onClick={onToggleSeoCollapsed}
                >
                  <Typography variant="h4" className="mb-0">
                    {t.contentEdit.publishTitle}
                  </Typography>
                  {seoChevron()}
                </button>
                {!seoCollapsed && (
                  <>
                <Typography variant="caption" color="muted" className="mb-2">
                  {t.contentEdit.statusLabel}
                </Typography>
                <Flex gap={1} className="flex-wrap mb-3">
                  {CONTENT_EDIT_STATUS_ORDER.map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={status === value ? 'primary' : 'outline'}
                      onClick={() => onStatusSelect(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </Flex>
                <Input
                  id={CONTENT_EDIT_SLUG_ID}
                  label={t.contentEdit.slug}
                  value={slug}
                  onChange={onStringInput(setSlug)}
                />
                <Input
                  id={CONTENT_EDIT_AUTHOR_ID}
                  label={t.contentEdit.author}
                  value={author}
                  onChange={onStringInput(setAuthor)}
                />
                <Input
                  id={CONTENT_EDIT_FEATURED_ID}
                  label={t.contentEdit.featuredImage}
                  value={featuredImage}
                  onChange={onStringInput(setFeaturedImage)}
                />
                <MultiSelect
                  id={CONTENT_EDIT_TAGS_ID}
                  label={t.contentEdit.tags}
                  options={tagOptions}
                  value={tagValues}
                  onChange={(next) => {
                    setTags(joinTags(next));
                    markUnsaved();
                  }}
                />
                <Input
                  id={CONTENT_EDIT_CATEGORIES_ID}
                  label={t.contentEdit.categories}
                  value={categories}
                  onChange={onStringInput(setCategories)}
                />
                <Typography variant="h5" className="mt-3 mb-1">
                  {t.contentEdit.seoPanel}
                </Typography>
                <Input
                  id={CONTENT_EDIT_SEO_TITLE_ID}
                  label={t.contentEdit.seoTitle}
                  value={seoTitle}
                  onChange={onStringInput(setSeoTitle)}
                />
                <Input
                  id={CONTENT_EDIT_SEO_DESC_ID}
                  label={t.contentEdit.seoDescription}
                  value={seoDescription}
                  onChange={onStringInput(setSeoDescription)}
                />
                <Input
                  id={CONTENT_EDIT_SEO_KEYWORD_ID}
                  label={t.contentEdit.seoKeyword}
                  value={seoKeyword}
                  onChange={onStringInput(setSeoKeyword)}
                />
                <Typography variant="h5" className="mt-3 mb-1">
                  {t.contentEdit.socialPanel}
                </Typography>
                <Input
                  id={CONTENT_EDIT_OG_TITLE_ID}
                  label={t.contentEdit.ogTitle}
                  value={ogTitle}
                  onChange={onStringInput(setOgTitle)}
                />
                <Input
                  id={CONTENT_EDIT_OG_DESC_ID}
                  label={t.contentEdit.ogDescription}
                  value={ogDescription}
                  onChange={onStringInput(setOgDescription)}
                />
                <Input
                  id={CONTENT_EDIT_OG_IMAGE_ID}
                  label={t.contentEdit.ogImage}
                  value={ogImage}
                  onChange={onStringInput(setOgImage)}
                />
                <DatePicker
                  id={CONTENT_EDIT_SCHEDULE_DATE_ID}
                  label={t.contentEdit.scheduleDate}
                  value={splitScheduleAt(scheduleAt).date}
                  onChange={(date) => {
                    setScheduleAt(joinScheduleAt(date, splitScheduleAt(scheduleAt).time));
                    setSaveOk(false);
                  }}
                />
                <TimePicker
                  label={t.contentEdit.scheduleTime}
                  format="24h"
                  value={splitScheduleAt(scheduleAt).time}
                  onChange={(time) => {
                    const next = splitScheduleAt(scheduleAt);
                    setScheduleAt(joinScheduleAt(next.date, time || next.time));
                    setSaveOk(false);
                  }}
                />
                <Typography variant="caption" className="bifrost-cms__muted mt-2 mb-0 block">
                  {t.contentEdit.collabHint}
                </Typography>
                  </>
                )}
              </Card>

              <CastPageFields
                fields={displayFields}
                values={castValues}
                lockedFieldIds={lockedFieldIds}
                onAddField={() => {
                  setPageFields((current) => [...current, createCastField()]);
                  setSaveOk(false);
                }}
                onFieldChange={onFieldChange}
                onRemoveField={(id) => {
                  setPageFields((current) => current.filter((field) => field.id !== id));
                  setSaveOk(false);
                }}
                onValueChange={(name, value) => {
                  setCastValues((current) => ({ ...current, [name]: value }));
                  setSaveOk(false);
                }}
              />

              <Card className="mb-3" padding={CMS_CARD_PADDING}>
                <Typography variant="h4" className="mb-1">
                  {t.contentEdit.revisionsTitle}
                </Typography>
                <Typography variant="caption" color="muted" className="mb-3">
                  {t.contentEdit.revisionsHint}
                </Typography>
                {revisions.length === 0 ? (
                  <Typography variant="caption" color="muted" className="mb-0">
                    {t.contentEdit.revisionsEmpty}
                  </Typography>
                ) : (
                  <Flex direction="column" gap={2}>
                    {revisions.map((revision) => (
                      <button
                        key={revision.id}
                        type="button"
                        className="bifrost-cms-widget-chip"
                        onClick={() => restoreRevision(revision)}
                      >
                        <Typography variant="body2" className="mb-0 font-medium">
                          {revision.status}
                        </Typography>
                        <Typography variant="caption" className="bifrost-cms__muted mb-0">
                          {new Date(revision.savedAt).toLocaleString()}
                        </Typography>
                      </button>
                    ))}
                  </Flex>
                )}
              </Card>

            </aside>
            </div>
          </div>
        ) : null}
      </Flex>
      <Drawer
        isOpen={widgetsOpen}
        onClose={() => setWidgetsOpen(false)}
        title={t.contentEdit.widgetsTitle}
        side="left"
        size="sm"
      >
        <Typography variant="caption" className="bifrost-cms__muted mb-3 block">
          {t.contentEdit.widgetsHint}
        </Typography>
        <Flex direction="column" gap={2}>
          {BEAR_WIDGET_CATALOG.map((widget) => (
            <button
              key={widget.id}
              type="button"
              className="bifrost-cms-widget-chip"
              draggable
              onDragStart={(event) => onDragStart(event, widget.id)}
              onClick={() => insertWidget(widget)}
            >
              <Typography variant="body2" className="mb-0 font-medium">
                {widget.label}
              </Typography>
              <Typography variant="caption" className="bifrost-cms__muted mb-0">
                {widget.bearComponent}
              </Typography>
            </button>
          ))}
        </Flex>
      </Drawer>
    </CmsShell>
  );
};
