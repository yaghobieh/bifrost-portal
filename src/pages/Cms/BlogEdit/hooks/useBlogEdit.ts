import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { useAuth } from '@hooks/useAuth';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING, ROUTES, SLASH } from '@const/index';
import { authNucleus, contentNucleus } from '@sdk/index';
import type { ContentStatus } from '@sdk/modules/content';
import { loadCmsProfile, loadCmsSite } from '@pages/Cms/SettingsPages';
import {
  CONTENT_EDIT_STATUS_ORDER,
  PAYLOAD_HTML_KEY,
  PAYLOAD_KEY_AUTHOR,
  PAYLOAD_KEY_CATEGORIES,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_FEATURED,
  PAYLOAD_KEY_SCHEDULE,
  PAYLOAD_KEY_SEO_DESCRIPTION,
  PAYLOAD_KEY_SEO_TITLE,
  PAYLOAD_KEY_TAGS,
} from '@pages/Cms/ContentEdit/ContentEdit.const';
import {
  htmlFromPayload,
  nowScheduleAt,
  payloadString,
  payloadStringPromise,
} from '@pages/Cms/ContentEdit/ContentEdit.utils';
import { DOCUMENT_DEFAULT_LOCALE } from '@pages/Cms/ContentPages/ContentPages.const';
import { isStringValue } from '@utils';
import {
  BLOG_CATEGORIES,
  BLOG_COLLECTION,
  BLOG_FIELD,
  BLOG_ROUTE_PREFIX,
  BLOG_SEO_DESC_MAX,
  BLOG_SEO_TITLE_MAX,
} from '@pages/Cms/BlogPages/BlogPages.const';
import {
  BLOG_EDIT_DEFAULT_CATEGORY,
  BLOG_EDIT_DEFAULT_STATUS,
} from '../BlogEdit.const';
import {
  blogRoutePrefix,
  buildBlogSavePayload,
  formatBlogSeoCount,
} from '../BlogEdit.utils';
import type { UseBlogEditResult } from '../BlogEdit.types';

/**
 * Owns blog-edit load, field state, and save for `/cms/blog/:id`.
 *
 * Hydrates from the content nucleus item. Category keys may be a string or
 * an array; {@link payloadStringPromise} reads the first non-empty value.
 *
 * @returns Field state, SEO counts, category options, and change handlers.
 */
export const useBlogEdit = (): UseBlogEditResult => {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, saving, fetchContent, saveContent } = useNucleus(contentNucleus);
  const activeToken = token || providerToken;
  const id = params.id || EMPTY_STRING;
  const actorName = loadCmsProfile().displayName || loadCmsProfile().username;

  const [title, setTitle] = useState(EMPTY_STRING);
  const [excerpt, setExcerpt] = useState(EMPTY_STRING);
  const [bodyHtml, setBodyHtml] = useState(EMPTY_STRING);
  const [seoTitle, setSeoTitle] = useState(EMPTY_STRING);
  const [seoDescription, setSeoDescription] = useState(EMPTY_STRING);
  const [status, setStatus] = useState<ContentStatus>(BLOG_EDIT_DEFAULT_STATUS);
  const [slug, setSlug] = useState(EMPTY_STRING);
  const [category, setCategory] = useState<string>(BLOG_EDIT_DEFAULT_CATEGORY);
  const [tags, setTags] = useState(EMPTY_STRING);
  const [author, setAuthor] = useState(actorName);
  const [scheduleAt, setScheduleAt] = useState(nowScheduleAt);
  const [cover, setCover] = useState(EMPTY_STRING);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    if (!activeToken) {
      return;
    }
    void fetchContent(activeToken);
  }, [activeToken, fetchContent]);

  const item = useMemo(
    () => items.find((entry) => entry.id === id && entry.collection === BLOG_COLLECTION),
    [id, items],
  );

  useEffect(() => {
    if (!item) {
      return;
    }
    let cancelled = false;
    const hydrate = async () => {
      const nextExcerpt = await payloadStringPromise(item.payload, BLOG_FIELD.EXCERPT);
      const nextHtml = await payloadStringPromise(
        item.payload,
        PAYLOAD_HTML_KEY,
        BLOG_FIELD.BODY,
      );
      const nextSeoTitle = await payloadStringPromise(
        item.payload,
        PAYLOAD_KEY_SEO_TITLE,
      );
      const nextSeoDescription = await payloadStringPromise(
        item.payload,
        PAYLOAD_KEY_SEO_DESCRIPTION,
      );
      const nextCategory = await payloadStringPromise(
        item.payload,
        PAYLOAD_KEY_CATEGORIES,
        BLOG_FIELD.CATEGORY,
      );
      const nextTags = await payloadStringPromise(item.payload, PAYLOAD_KEY_TAGS);
      const nextAuthor = await payloadStringPromise(item.payload, PAYLOAD_KEY_AUTHOR);
      const nextSchedule = await payloadStringPromise(item.payload, PAYLOAD_KEY_SCHEDULE);
      const nextCover = await payloadStringPromise(item.payload, PAYLOAD_KEY_FEATURED);
      if (cancelled) {
        return;
      }
      setTitle(item.title || EMPTY_STRING);
      setSlug(item.slug);
      setStatus(item.status);
      setExcerpt(nextExcerpt);
      setBodyHtml(nextHtml || htmlFromPayload(item.payload));
      setSeoTitle(nextSeoTitle || item.title);
      setSeoDescription(nextSeoDescription);
      setCategory(nextCategory || BLOG_EDIT_DEFAULT_CATEGORY);
      setTags(nextTags);
      setAuthor(nextAuthor || actorName);
      setScheduleAt(nextSchedule || nowScheduleAt());
      setCover(nextCover);
      setSaveOk(false);
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [actorName, item]);

  const onString =
    (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setSaveOk(false);
    };

  const onCategoryChange = (value: unknown) => {
    if (!isStringValue(value)) {
      return;
    }
    setCategory(value);
    setSaveOk(false);
  };

  const onBodyChange = (next: string) => {
    setBodyHtml(next);
    setSaveOk(false);
  };

  const onStatus = (value: ContentStatus) => {
    setStatus(value);
    setSaveOk(false);
  };

  const onSave = async () => {
    if (!activeToken || !item) {
      return;
    }
    const createdBy =
      payloadString(item.payload, PAYLOAD_KEY_CREATED_BY) || actorName;
    const ok = await saveContent(activeToken, {
      collection: BLOG_COLLECTION,
      slug,
      locale: item.locale || DOCUMENT_DEFAULT_LOCALE,
      title,
      status,
      payload: buildBlogSavePayload({
        base: item.payload,
        excerpt,
        bodyHtml,
        seoTitle,
        seoDescription,
        category,
        tags,
        author,
        scheduleAt,
        cover,
        createdBy,
        updatedBy: actorName,
      }),
    });
    setSaveOk(ok);
  };

  const categoryOptions = useMemo(
    () => BLOG_CATEGORIES.map((value) => ({ value, label: value })),
    [],
  );
  const seoTitleCount = useMemo(
    () => formatBlogSeoCount(t.dashboard.blogSeoCount, seoTitle.length, BLOG_SEO_TITLE_MAX),
    [seoTitle.length, t.dashboard.blogSeoCount],
  );
  const seoDescCount = useMemo(
    () =>
      formatBlogSeoCount(t.dashboard.blogSeoCount, seoDescription.length, BLOG_SEO_DESC_MAX),
    [seoDescription.length, t.dashboard.blogSeoCount],
  );
  const routePrefix = useMemo(
    () => blogRoutePrefix(loadCmsSite().blogPath, SLASH, BLOG_ROUTE_PREFIX),
    [],
  );

  return {
    t,
    loading,
    saving,
    item,
    title,
    excerpt,
    bodyHtml,
    seoTitle,
    seoDescription,
    status,
    slug,
    category,
    tags,
    author,
    scheduleAt,
    cover,
    saveOk,
    routePrefix,
    categoryOptions,
    seoTitleCount,
    seoDescCount,
    statusOrder: CONTENT_EDIT_STATUS_ORDER,
    onBack: () => navigate(ROUTES.CMS_BLOG),
    onSave,
    onTitleChange: onString(setTitle),
    onExcerptChange: onString(setExcerpt),
    onSeoTitleChange: onString(setSeoTitle),
    onSeoDescriptionChange: onString(setSeoDescription),
    onSlugChange: onString(setSlug),
    onTagsChange: onString(setTags),
    onAuthorChange: onString(setAuthor),
    onScheduleChange: onString(setScheduleAt),
    onCoverChange: onString(setCover),
    onBodyChange,
    onStatus,
    onCategoryChange,
  };
};
