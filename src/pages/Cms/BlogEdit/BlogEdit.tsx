import type { FC } from 'react';
import { Button, Card, Flex, Input, Select, Typography } from '@forgedevstack/bear';
import { InkEditor } from '@forgedevstack/ink';
import { cmsInkAiProps } from '@/ai/index';
import { CmsShell, CMS_NAV_IDS, CMS_CARD_PADDING, CmsPageHeader } from '../CmsShell';
import { NUMBER_FOUR_HUNDRED_TWENTY } from '@const/numbers.const';
import {
  BLOG_EDIT_EXCERPT_ID,
  BLOG_EDIT_SLUG_ID,
  BLOG_EDIT_TITLE_ID,
} from '../BlogPages/BlogPages.const';
import {
  BLOG_EDIT_INK_COLOR_MODE,
  BLOG_EDIT_INK_FEATURES,
  BLOG_EDIT_INK_VARIANT,
} from './BlogEdit.const';
import { useBlogEdit } from './hooks';

export const BlogEdit: FC = () => {
  const {
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
    statusOrder,
    onBack,
    onSave,
    onTitleChange,
    onExcerptChange,
    onSeoTitleChange,
    onSeoDescriptionChange,
    onSlugChange,
    onTagsChange,
    onAuthorChange,
    onScheduleChange,
    onCoverChange,
    onBodyChange,
    onStatus,
    onCategoryChange,
  } = useBlogEdit();

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.BLOG}>
      <Flex direction="column" gap={4} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.dashboard.blogNewPost}
          subtitle={title || t.dashboard.blogSubtitle}
          extra={
            <Card variant="elevated" padding="md">
              <Flex justify="between" align="center" gap={3} className="flex-wrap">
                <Button size="sm" variant="outline" onClick={onBack}>
                  {t.contentEdit.backToContent}
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!item || saving}
                  onClick={() => void onSave()}
                >
                  {saving ? t.dashboard.saving : t.dashboard.save}
                </Button>
              </Flex>
            </Card>
          }
        />
        {loading && !item && (
          <Typography variant="body2">{t.contentEdit.loading}</Typography>
        )}
        {!loading && !item && (
          <div className="bifrost-cms__muted">
            <Typography variant="body2">{t.contentEdit.notFound}</Typography>
          </div>
        )}
        {item && (
          <Card padding={CMS_CARD_PADDING} className="bifrost-cms-blog-edit">
            <div className="bifrost-cms-blog-edit__grid">
              <Flex direction="column" gap={3}>
                <Input
                  id={BLOG_EDIT_TITLE_ID}
                  label={t.contentEdit.titleField}
                  value={title}
                  onChange={onTitleChange}
                />
                <Input
                  id={BLOG_EDIT_EXCERPT_ID}
                  label={t.dashboard.blogExcerpt}
                  value={excerpt}
                  onChange={onExcerptChange}
                />
                <div className="bifrost-cms-ink-block">
                  <Typography variant="caption" className="bifrost-cms-ink-block__tag mb-0">
                    {t.contentEdit.inkBlock}
                  </Typography>
                  <InkEditor
                    value={bodyHtml}
                    onChange={onBodyChange}
                    colorMode={BLOG_EDIT_INK_COLOR_MODE}
                    variant={BLOG_EDIT_INK_VARIANT}
                    minHeight={NUMBER_FOUR_HUNDRED_TWENTY}
                    features={BLOG_EDIT_INK_FEATURES}
                    ai={cmsInkAiProps()}
                  />
                </div>
                <Input
                  label={t.contentEdit.seoTitle}
                  value={seoTitle}
                  onChange={onSeoTitleChange}
                />
                <Typography variant="caption" className="bifrost-cms__muted mb-0">
                  {seoTitleCount}
                </Typography>
                <Input
                  label={t.contentEdit.seoDescription}
                  value={seoDescription}
                  onChange={onSeoDescriptionChange}
                />
                <Typography variant="caption" className="bifrost-cms__muted mb-0">
                  {seoDescCount}
                </Typography>
              </Flex>
              <Flex direction="column" gap={3}>
                <Typography variant="caption" className="bifrost-cms-edit__set-label mb-0">
                  {t.contentEdit.statusLabel}
                </Typography>
                <Flex gap={1} className="flex-wrap">
                  {statusOrder.map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={status === value ? 'primary' : 'outline'}
                      onClick={() => onStatus(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </Flex>
                <div>
                  <Typography variant="caption" className="bifrost-cms-edit__set-label mb-1">
                    {t.contentEdit.slug}
                  </Typography>
                  <div className="bifrost-cms-edit__route">
                    <span className="bifrost-cms-edit__route-prefix">{routePrefix}</span>
                    <Input id={BLOG_EDIT_SLUG_ID} value={slug} onChange={onSlugChange} />
                  </div>
                </div>
                <Select
                  label={t.dashboard.blogCategory}
                  options={categoryOptions}
                  value={category}
                  onChange={onCategoryChange}
                  fullWidth
                />
                <Input label={t.contentEdit.tags} value={tags} onChange={onTagsChange} />
                <Input label={t.contentEdit.author} value={author} onChange={onAuthorChange} />
                <Input
                  label={t.contentEdit.scheduleDate}
                  value={scheduleAt}
                  onChange={onScheduleChange}
                />
                <Input
                  label={t.dashboard.blogCover}
                  value={cover}
                  onChange={onCoverChange}
                />
                {saveOk && (
                  <Typography variant="caption" className="bifrost-cms-save-ok mb-0">
                    {t.dashboard.saved}
                  </Typography>
                )}
              </Flex>
            </div>
          </Card>
        )}
      </Flex>
    </CmsShell>
  );
};
