import { useEffect, useState, type FC } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { BearIcons, Button, Card, Flex, Spinner, Typography } from '@forgedevstack/bear';
import { useAuth, useSites } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { cmsBuilderPath, cmsEditPath } from '@const/index';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import { authNucleus, contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import {
  CONTENT_COLLECTION_PAGES,
  DOCUMENT_DEFAULT_LOCALE,
  DOCUMENT_STARTER_STATUS,
} from '../ContentPages/ContentPages.const';
import { canvasFromPayload, cloneCanvasTree } from '../BuilderPages/BuilderPages.utils';
import {
  PAYLOAD_KEY_CAST_FIELDS,
  PAYLOAD_KEY_CAST_VALUES,
  PAYLOAD_KEY_LAYOUT,
  PAYLOAD_KEY_TEMPLATE,
} from '../ContentEdit/ContentEdit.const';
import { castFieldsFromPayload, castValuesFromPayload } from '../ContentEdit/castFields.utils';
import { isDocsLayout } from '../ContentPages/ContentPages.utils';
import {
  PAGE_LAYOUT_TEMPLATES,
  PAGE_SLUG_PREFIX,
  TEMPLATES_COLLECTION,
  TEMPLATE_SLUG_PREFIX,
} from './TemplatesPages.const';
import { ShareContentModal, type ShareContentItem } from '../ContentPages/helpers/ShareContentModal';

export const TemplatesPages: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, error, saving, fetchContent, deleteContent } = useNucleus(contentNucleus);
  const { sites, activeSiteId } = useSites();
  const activeToken = token || providerToken;

  const [shareItem, setShareItem] = useState<ShareContentItem | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (activeToken) {
      void fetchContent(activeToken);
    }
  }, [activeToken, fetchContent]);

  const templates = items.filter((item) => item.collection === TEMPLATES_COLLECTION);

  const handleShareTemplate = (entry: { id: string; title?: string; slug?: string; description?: string }) => {
    setShareItem({
      id: entry.id,
      title: entry.title || entry.slug || 'Template',
      slug: entry.slug || entry.id,
      kind: 'template',
      collection: TEMPLATES_COLLECTION,
      currentSiteId: activeSiteId,
    });
    setShowShareModal(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!activeToken) return;
    if (!window.confirm(t.dashboard.deleteConfirm.replace('{count}', '1'))) return;
    await deleteContent(activeToken, id);
    await fetchContent(activeToken);
  };

  const handleShareToSite = async (targetSiteId: string, item: ShareContentItem) => {
    if (!activeToken) return;
    const source = items.find((i) => i.id === item.id);
    if (!source) {
      const layout = PAGE_LAYOUT_TEMPLATES.find((l) => l.id === item.id);
      if (layout) {
        await saveContentRequest(activeToken, {
          collection: TEMPLATES_COLLECTION,
          slug: `${layout.id}-${targetSiteId}-${Date.now()}`,
          locale: DOCUMENT_DEFAULT_LOCALE,
          title: `${layout.title} (${targetSiteId})`,
          status: DOCUMENT_STARTER_STATUS,
          payload: {
            canvas: cloneCanvasTree(layout.tree),
            [PAYLOAD_KEY_LAYOUT]: layout.id,
            siteId: targetSiteId,
            site_id: targetSiteId,
            [PAYLOAD_KEY_CAST_FIELDS]: layout.castFields,
            [PAYLOAD_KEY_CAST_VALUES]: layout.castValues,
          },
        });
        await fetchContent(activeToken);
      }
      return;
    }
    await saveContentRequest(activeToken, {
      collection: TEMPLATES_COLLECTION,
      slug: `${source.slug}-${targetSiteId}`,
      locale: source.locale || DOCUMENT_DEFAULT_LOCALE,
      title: `${source.title} (${targetSiteId})`,
      status: source.status || DOCUMENT_STARTER_STATUS,
      payload: {
        ...source.payload,
        siteId: targetSiteId,
        site_id: targetSiteId,
      },
    });
    await fetchContent(activeToken);
  };

  const onNewTemplate = async () => {
    if (!activeToken) return;
    const blank = PAGE_LAYOUT_TEMPLATES.find((layout) => layout.id === 'blank-canvas');
    const slug = `${TEMPLATE_SLUG_PREFIX}${Date.now()}`;
    const item = await saveContentRequest(activeToken, {
      collection: TEMPLATES_COLLECTION,
      slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: t.cmsTemplates.newTemplate,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        canvas: blank ? cloneCanvasTree(blank.tree) : [],
        [PAYLOAD_KEY_CAST_FIELDS]: [],
        [PAYLOAD_KEY_CAST_VALUES]: {},
      },
    });
    if (!item) return;
    await fetchContent(activeToken);
    navigate(cmsBuilderPath({ doc: item.id }));
  };

  const onUseLayout = async (layoutId: string) => {
    if (!activeToken) return;
    const layout = PAGE_LAYOUT_TEMPLATES.find((item) => item.id === layoutId);
    if (!layout) return;
    const slug = `${PAGE_SLUG_PREFIX}${Date.now()}`;
    const item = await saveContentRequest(activeToken, {
      collection: CONTENT_COLLECTION_PAGES,
      slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: layout.title,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        canvas: cloneCanvasTree(layout.tree),
        [PAYLOAD_KEY_LAYOUT]: layout.id,
        [PAYLOAD_KEY_CAST_FIELDS]: layout.castFields,
        [PAYLOAD_KEY_CAST_VALUES]: layout.castValues,
      },
    });
    if (!item) return;
    await fetchContent(activeToken);
    if (isDocsLayout(layout.id)) {
      navigate(cmsEditPath(item.id));
      return;
    }
    navigate(cmsBuilderPath({ doc: item.id }));
  };

  const onUseSaved = async (templateId: string) => {
    if (!activeToken) return;
    const saved = items.find((entry) => entry.id === templateId);
    if (!saved) return;
    const fromSaved = canvasFromPayload(saved.payload);
    const slug = `${PAGE_SLUG_PREFIX}${Date.now()}`;
    const layoutId =
      typeof saved.payload[PAYLOAD_KEY_LAYOUT] === 'string'
        ? saved.payload[PAYLOAD_KEY_LAYOUT]
        : undefined;
    const item = await saveContentRequest(activeToken, {
      collection: CONTENT_COLLECTION_PAGES,
      slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: saved.title || saved.slug,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        canvas: fromSaved ? cloneCanvasTree(fromSaved) : [],
        [PAYLOAD_KEY_LAYOUT]: layoutId,
        [PAYLOAD_KEY_TEMPLATE]: saved.id,
        [PAYLOAD_KEY_CAST_FIELDS]: castFieldsFromPayload(saved.payload),
        [PAYLOAD_KEY_CAST_VALUES]: castValuesFromPayload(saved.payload),
      },
    });
    if (!item) return;
    await fetchContent(activeToken);
    navigate(cmsEditPath(item.id));
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.TEMPLATES}>
      <Flex direction="column" gap={6}>
        <CmsPageHeader
          title={t.cmsTemplates.title}
          subtitle={t.cmsTemplates.subtitle}
          actionTitle={t.cmsTemplates.newTemplate}
          actionBody={t.cmsTemplates.subtitle}
          extra={
            <Button
              size="sm"
              variant="primary"
              icon={<BearIcons.PlusIcon size={CMS_ICON_SIZE} />}
              onClick={() => void onNewTemplate()}
              disabled={saving || !activeToken}
            >
              {t.cmsTemplates.newTemplate}
            </Button>
          }
        />
        <Typography variant="h4" className="mb-0">
          {t.cmsTemplates.layoutsTitle}
        </Typography>
        <div className="bifrost-cms-templates-grid">
          {PAGE_LAYOUT_TEMPLATES.map((layout) => (
            <Card
              padding="md"
              key={layout.id}
              className="cursor-pointer hover:border-blue-400 transition-all select-none"
              onDoubleClick={() => handleShareTemplate(layout)}
              title="Double-click to share across sites"
            >
              <Flex direction="column" gap={2}>
                <Typography variant="h4" className="mb-0">
                  {layout.title}
                </Typography>
                <Typography variant="body2" className="bifrost-cms__muted mb-0">
                  {layout.description}
                </Typography>
                <div className="bifrost-cms-template-preview">
                  {layout.tree.map((node) => (
                    <Typography key={node.id} variant="caption" className="mb-0">
                      {node.label}
                    </Typography>
                  ))}
                </div>
                <Flex gap={2} className="flex-wrap items-center">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<BearIcons.GridIcon size={CMS_ICON_SIZE} />}
                    onClick={() => navigate(cmsBuilderPath({ layout: layout.id }))}
                  >
                    {t.cmsTemplates.design}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareTemplate(layout)}
                    title="Share template across sites"
                  >
                    <svg className="w-3.5 h-3.5 fill-current mr-1" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                    </svg>
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void onUseLayout(layout.id)}
                    disabled={saving || !activeToken}
                  >
                    {t.cmsTemplates.useLayout}
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </div>
        <Typography variant="h4" className="mb-0">
          {t.cmsTemplates.savedTitle}
        </Typography>
        {loading ? (
          <Flex align="center" gap={2}>
            <Spinner size="sm" />
            <Typography variant="body2" className="mb-0">
              {t.dashboard.loading}
            </Typography>
          </Flex>
        ) : null}
        {error ? (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.error}
          </Typography>
        ) : null}
        {templates.length === 0 && !loading ? (
          <Typography variant="body2" className="bifrost-cms__muted mb-0">
            {t.cmsTemplates.empty}
          </Typography>
        ) : (
          <div className="bifrost-cms-templates-grid">
            {templates.map((item) => (
              <Card
                padding="md"
                key={item.id}
                className="cursor-pointer hover:border-blue-400 transition-all select-none"
                onDoubleClick={() => handleShareTemplate(item)}
                title="Double-click to share across sites"
              >
                <Flex direction="column" gap={2}>
                  <Typography variant="h4" className="mb-0">
                    {item.title || item.slug}
                  </Typography>
                  <Typography variant="caption" className="bifrost-cms__muted mb-0">
                    {item.collection} · {item.status} · {t.cmsTemplates.fieldCount}{' '}
                    {castFieldsFromPayload(item.payload).length}
                  </Typography>
                  <Flex gap={2} className="flex-wrap items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<BearIcons.EditIcon size={CMS_ICON_SIZE} />}
                      onClick={() => navigate(cmsBuilderPath({ doc: item.id }))}
                      title="Edit design in Builder"
                    >
                      {t.cmsTemplates.design}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(cmsEditPath(item.id))}
                      title="Edit template fields"
                    >
                      {t.cmsTemplates.editFields}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareTemplate(item)}
                      title="Share template across sites"
                    >
                      <svg className="w-3.5 h-3.5 fill-current mr-1" viewBox="0 0 24 24">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void handleDeleteTemplate(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      title="Delete template"
                    >
                      <BearIcons.DeleteIcon size={CMS_ICON_SIZE} />
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => void onUseSaved(item.id)}
                      disabled={saving || !activeToken}
                    >
                      {t.cmsTemplates.useTemplate}
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </div>
        )}
      </Flex>

      <ShareContentModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareItem(null);
        }}
        item={shareItem}
        sites={sites}
        activeSiteId={activeSiteId}
        onShareToSite={handleShareToSite}
      />
    </CmsShell>
  );
};
