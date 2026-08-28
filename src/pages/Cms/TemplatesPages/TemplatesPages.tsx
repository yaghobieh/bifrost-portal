import { useEffect, type FC } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { BearIcons, Button, Card, Flex, Spinner, Typography } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
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
  TEMPLATES_CTA_VARIANT,
  TEMPLATE_SLUG_PREFIX,
} from './TemplatesPages.const';

export const TemplatesPages: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, error, saving, fetchContent } = useNucleus(contentNucleus);
  const activeToken = token || providerToken;

  useEffect(() => {
    if (activeToken) {
      void fetchContent(activeToken);
    }
  }, [activeToken, fetchContent]);

  const templates = items.filter((item) => item.collection === TEMPLATES_COLLECTION);

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
          actions={
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
            <Card padding="md" key={layout.id} className="bifrost-cms-template-card">
              <Flex direction="column" gap={2} className="bifrost-cms-template-card__inner">
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
                <Flex gap={2} className="flex-wrap bifrost-cms-template-card__cta">
                  <Button
                    size="sm"
                    variant={TEMPLATES_CTA_VARIANT}
                    icon={<BearIcons.GridIcon size={CMS_ICON_SIZE} />}
                    onClick={() => navigate(cmsBuilderPath({ layout: layout.id }))}
                  >
                    {t.cmsTemplates.design}
                  </Button>
                  <Button
                    size="sm"
                    variant={TEMPLATES_CTA_VARIANT}
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
              <Card padding="md" key={item.id} className="bifrost-cms-template-card">
                <Flex direction="column" gap={2} className="bifrost-cms-template-card__inner">
                  <Typography variant="h4" className="mb-0">
                    {item.title || item.slug}
                  </Typography>
                  <Typography variant="caption" className="bifrost-cms__muted mb-0">
                    {item.collection} · {item.status} · {t.cmsTemplates.fieldCount}{' '}
                    {castFieldsFromPayload(item.payload).length}
                  </Typography>
                  <Flex gap={2} className="flex-wrap bifrost-cms-template-card__cta">
                    <Button
                      size="sm"
                      variant={TEMPLATES_CTA_VARIANT}
                      icon={<BearIcons.EditIcon size={CMS_ICON_SIZE} />}
                      onClick={() => navigate(cmsBuilderPath({ doc: item.id }))}
                    >
                      {t.cmsTemplates.design}
                    </Button>
                    <Button
                      size="sm"
                      variant={TEMPLATES_CTA_VARIANT}
                      onClick={() => navigate(cmsEditPath(item.id))}
                    >
                      {t.cmsTemplates.editFields}
                    </Button>
                    <Button
                      size="sm"
                      variant={TEMPLATES_CTA_VARIANT}
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
    </CmsShell>
  );
};
