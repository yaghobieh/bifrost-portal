import { type FC, useState } from 'react';
import { Alert, Accordion, BearIcons, Button, Card, Dropdown, Flex, Input, Select, Tab, TabList, TabPanel, Tabs, Typography } from '@forgedevstack/bear';
import { CMS_ICON_SIZE, NUMBER_THREE, NUMBER_TWO, NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING, JQUERY_SCRIPT_SRC, ROUTES } from '@const/index';
import { useAuth } from '@hooks/index';
import { uploadAndRegisterMedia } from '@sdk/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { useCmsLive } from '../CmsShell/CmsLiveProvider';
import { currentLiveLocation } from '../CmsShell/CmsLive.utils';
import { isPageSubmitLocked, locationOwner } from '../CmsShell/helpers/LiveEditors';
import { CanvasContextMenu, canvasMenuVars } from './helpers/CanvasContextMenu';
import type { CanvasContextMenuLabels } from './helpers/CanvasContextMenu/CanvasContextMenu.types';
import { BuilderCanvasNode } from './helpers/BuilderCanvasNode';
import { BuilderImageFields } from './helpers/BuilderImageFields';
import type { BuilderImageFieldKey } from './helpers/BuilderImageFields';
import { BuilderInspectorStyle } from './helpers/BuilderInspectorStyle';
import { BuilderPaletteGroup } from './helpers/BuilderPaletteGroup';
import { BuilderStageRuntime } from './helpers/BuilderStageRuntime';
import { BuilderWidgetChip, paletteGroupIcon } from './helpers/BuilderWidgetChip';
import {
  AI_STYLE_SUGGESTIONS,
  BUILDER_INSPECTOR_TAB,
  BUILDER_PUBLISH_KEY_SAVE,
  BUILDER_PUBLISH_KEY_TEMPLATE,
  BUILDER_PX_SUFFIX,
  BUILDER_STAGE_PREVIEW_CLASS,
  BUILDER_STYLE_EMPTY,
  BUILDER_VIEWPORT,
  CANVAS_KIND,
  LAYOUT_BLOCKS,
  PALETTE_ACCORDION_DEFAULT,
  PALETTE_GROUP_ID,
} from './BuilderPages.const';
import type { BuilderInspectorTab, CanvasNode } from './BuilderPages.types';
import {
  builderLayoutVars,
  duplicateNode,
  isContainerKind,
  layerDepth,
  removeNode,
  stageShellVars,
  stageViewportModifier,
  updateNodeCss,
  updateNodeHtml,
  updateNodeJs,
  updateNodeLabel,
  updateNodeStyles,
} from './BuilderPages.utils';
import { IMAGE_ATTR_BY_FIELD } from './BearPalette.const';
import { htmlHasImg, readI18nKey, readImgAttr, writeI18nKey, writeImgAttr } from './BearPalette.utils';
import { BuilderBoardNiche } from './BuilderBoardNiche';
import { BuilderCodeField } from './BuilderCodeField';
import { completeMarketingPage, isHttpsScriptSrc } from './marketingAi.utils';
import { useBuilderPages, useBuilderTranslations, useStagePreviewResize } from './hooks';

export const BuilderPages: FC = () => {
  const {
    t,
    installed,
    tree,
    selectedId,
    setSelectedId,
    setDropParentId,
    menu,
    setMenu,
    saved,
    setSaved,
    targetId,
    viewport,
    preview,
    onClearSelection,
    onClearStage,
    onStageContextMenu,
    onStageDragOver,
    onViewportDesktop,
    onViewportTablet,
    onViewportMobile,
    onTogglePreview,
    inspectorTab,
    setInspectorTab,
    pageCode,
    setPageCode,
    customLabel,
    setCustomLabel,
    customHtml,
    setCustomHtml,
    previewWidth,
    setPreviewWidth,
    stageTab,
    paletteWidth,
    inspectorWidth,
    selected,
    selectedStyles,
    targetOptions,
    contentWidgets,
    formWidgets,
    marketingGroups,
    bearGroups,
    libraryQuery,
    setLibraryQuery,
    canPasteStyles,
    layers,
    apply,
    addLayout,
    addWidget,
    addColumns,
    addCustomWidget,
    onDragStartWidget,
    onDragStartLayout,
    onDragStartNode,
    acceptDrop,
    onContextMenu,
    runMenu,
    onSave,
    onSaveAsTemplate,
    onTargetChange,
    onStageTab,
    onPaletteResize,
    onInspectorResize,
    isContainerKind,
    navigate,
  } = useBuilderPages();
  const { token } = useAuth();
  const { localeBag, keyOptions, createKey } = useBuilderTranslations(targetId);
  const { onPreviewResizeStart } = useStagePreviewResize({ previewWidth, setPreviewWidth });
  const { onlineUsers, selfId } = useCmsLive();
  const liveLocation = currentLiveLocation().location;
  const pageLocked = isPageSubmitLocked({
    users: onlineUsers,
    currentUserId: selfId,
    location: liveLocation,
  });
  const pageOwner = locationOwner({ users: onlineUsers, location: liveLocation });
  const [scriptDraft, setScriptDraft] = useState(JQUERY_SCRIPT_SRC);
  const [i18nKeyDraft, setI18nKeyDraft] = useState(EMPTY_STRING);
  const [i18nValueDraft, setI18nValueDraft] = useState(EMPTY_STRING);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiFailed, setAiFailed] = useState(false);

  const applyBackground = (value: string) => {
    if (!selected) {
      return;
    }
    apply(
      updateNodeStyles(tree, selected.id, {
        ...selectedStyles,
        background: value,
      }),
    );
  };
  const applyRadius = (value: string) => {
    if (!selected) {
      return;
    }
    apply(
      updateNodeStyles(tree, selected.id, {
        ...selectedStyles,
        borderRadius: value,
      }),
    );
  };
  const applyWidth = (value: string) => {
    if (!selected) {
      return;
    }
    apply(
      updateNodeStyles(tree, selected.id, {
        ...selectedStyles,
        width: value ? `${value}${BUILDER_PX_SUFFIX}` : EMPTY_STRING,
      }),
    );
  };
  const applyStyleField = (key: keyof typeof selectedStyles, value: string) => {
    if (!selected) {
      return;
    }
    apply(
      updateNodeStyles(tree, selected.id, {
        ...selectedStyles,
        [key]: value,
      }),
    );
  };
  const applyHint = (id: string) => {
    if (!selected) {
      return;
    }
    const hint = AI_STYLE_SUGGESTIONS.find((item) => item.id === id);
    if (!hint) {
      return;
    }
    apply(
      updateNodeStyles(tree, selected.id, {
        ...selectedStyles,
        ...hint.styles,
      }),
    );
  };
  const onImageFieldChange = (key: BuilderImageFieldKey, value: string) => {
    if (!selected) {
      return;
    }
    apply(
      updateNodeHtml(
        tree,
        selected.id,
        writeImgAttr(selected.html || BUILDER_STYLE_EMPTY, IMAGE_ATTR_BY_FIELD[key], value),
      ),
    );
  };
  const onImageUpload = async (file: File) => {
    if (!selected || !token) {
      return;
    }
    const item = await uploadAndRegisterMedia(token, file);
    if (!item) {
      return;
    }
    onImageFieldChange('src', item.secureUrl || item.url);
  };
  const onI18nKeyChange = (value: string) => {
    if (!selected) {
      return;
    }
    apply(
      updateNodeHtml(
        tree,
        selected.id,
        writeI18nKey(selected.html || BUILDER_STYLE_EMPTY, String(value)),
      ),
    );
  };
  const onDuplicateNode = (id: string) => {
    apply(duplicateNode(tree, id));
  };
  const onDeleteNode = (id: string) => {
    apply(removeNode(tree, id));
    if (selectedId === id) {
      setSelectedId(EMPTY_STRING);
    }
  };
  const onNodeHtmlChange = (id: string, html: string) => {
    apply(updateNodeHtml(tree, id, html));
  };
  const renderNode = (node: CanvasNode) => (
    <BuilderCanvasNode
      key={node.id}
      node={node}
      selectedId={selectedId}
      preview={preview}
      tree={tree}
      duplicateLabel={t.cmsBuilder.menuDuplicate}
      deleteLabel={t.cmsBuilder.menuDelete}
      resizeLabel={t.cmsBuilder.resizeWidget}
      apply={apply}
      setSelectedId={setSelectedId}
      setDropParentId={setDropParentId}
      onContextMenu={onContextMenu}
      onDragStartNode={onDragStartNode}
      acceptDrop={acceptDrop}
      onDuplicate={onDuplicateNode}
      onDelete={onDeleteNode}
      onHtmlChange={onNodeHtmlChange}
      renderChild={renderNode}
      localeBag={localeBag}
    />
  );

  const stageViewportClass = stageViewportModifier(viewport);
  const stagePreviewClass = preview ? ` ${BUILDER_STAGE_PREVIEW_CLASS}` : EMPTY_STRING;
  const onAddBlankSection = () => {
    addLayout(CANVAS_KIND.SECTION);
  };
  const contextMenuLabels: CanvasContextMenuLabels = {
    edit: t.cmsBuilder.menuEditContent,
    props: t.cmsBuilder.menuInspectProps,
    style: t.cmsBuilder.menuInspectStyle,
    duplicate: t.cmsBuilder.menuDuplicate,
    moveUp: t.cmsBuilder.menuMoveUp,
    moveDown: t.cmsBuilder.menuMoveDown,
    copyStyles: t.cmsBuilder.menuCopyStyles,
    pasteStyles: t.cmsBuilder.menuPasteStyles,
    saveReusable: t.cmsBuilder.menuSaveReusable,
    remove: t.cmsBuilder.menuDelete,
    kbdEdit: t.cmsBuilder.menuKbdEdit,
    kbdProps: t.cmsBuilder.menuKbdProps,
    kbdDuplicate: t.cmsBuilder.menuKbdDuplicate,
    kbdUp: t.cmsBuilder.menuKbdUp,
    kbdDown: t.cmsBuilder.menuKbdDown,
    kbdCopy: t.cmsBuilder.menuKbdCopy,
    kbdDelete: t.cmsBuilder.menuKbdDelete,
  };
  const inspectorTabs = [
    { id: BUILDER_INSPECTOR_TAB.CONTENT, label: t.cmsBuilder.inspectorContent },
    { id: BUILDER_INSPECTOR_TAB.STYLE, label: t.cmsBuilder.inspectorStyle },
    { id: BUILDER_INSPECTOR_TAB.CODE, label: t.cmsBuilder.inspectorAdvanced },
  ];
  const imageFields = selected
    ? [
        {
          key: 'src' as const,
          label: t.cmsBuilder.imageSrc,
          value: readImgAttr(selected.html || BUILDER_STYLE_EMPTY, IMAGE_ATTR_BY_FIELD.src),
        },
        {
          key: 'alt' as const,
          label: t.cmsBuilder.imageAlt,
          value: readImgAttr(selected.html || BUILDER_STYLE_EMPTY, IMAGE_ATTR_BY_FIELD.alt),
        },
        {
          key: 'width' as const,
          label: t.cmsBuilder.imageWidth,
          value: readImgAttr(selected.html || BUILDER_STYLE_EMPTY, IMAGE_ATTR_BY_FIELD.width),
        },
        {
          key: 'height' as const,
          label: t.cmsBuilder.imageHeight,
          value: readImgAttr(selected.html || BUILDER_STYLE_EMPTY, IMAGE_ATTR_BY_FIELD.height),
        },
        {
          key: 'loading' as const,
          label: t.cmsBuilder.imageLoading,
          value: readImgAttr(selected.html || BUILDER_STYLE_EMPTY, IMAGE_ATTR_BY_FIELD.loading),
        },
      ]
    : [];
  const onLayerClick = (id: string, kind: CanvasNode['kind']) => {
    setSelectedId(id);
    setDropParentId(isContainerKind(kind) ? id : EMPTY_STRING);
  };
  const renderLayers = () => {
    if (layers.length === NUMBER_ZERO) {
      return <Typography variant="caption">{t.cmsBuilder.layersEmpty}</Typography>;
    }
    return (
      <div className="bifrost-cms-layers">
        {layers.map((row) => (
          <Button
            key={row.id}
            type="button"
            size="sm"
            variant={row.id === selectedId ? 'ink' : 'ghost'}
            className={`bifrost-cms-layers__row${row.id === selectedId ? ' bifrost-cms-layers__row--selected' : EMPTY_STRING}`}
            data-depth={layerDepth(row.depth)}
            onClick={() => onLayerClick(row.id, row.kind)}
          >
            {row.label}
          </Button>
        ))}
      </div>
    );
  };
  const onPublishSave = () => {
    if (pageLocked) {
      return;
    }
    void onSave();
  };
  const onPublishTemplate = () => {
    if (pageLocked) {
      return;
    }
    void onSaveAsTemplate();
  };
  const publishItems = [
    {
      key: BUILDER_PUBLISH_KEY_SAVE,
      label: targetId ? t.cmsBuilder.saveToContent : t.cmsBuilder.saveCanvas,
      onClick: onPublishSave,
    },
    {
      key: BUILDER_PUBLISH_KEY_TEMPLATE,
      label: t.cmsBuilder.saveAsTemplate,
      onClick: onPublishTemplate,
    },
  ];
  const renderInspectorEmpty = () => (
    <Typography variant="caption">{t.cmsBuilder.inspectorEmpty}</Typography>
  );
  const renderCodePanel = () => {
    if (selected) {
      return (
        <>
          {selected.html !== undefined && selected.kind !== CANVAS_KIND.INK && (
            <BuilderCodeField
              label={t.cmsBuilder.inspectorHtml}
              value={selected.html}
              language="html"
              onChange={(value) => apply(updateNodeHtml(tree, selected.id, value))}
            />
          )}
          <BuilderCodeField
            label={t.cmsBuilder.inspectorCss}
            value={selected.css || BUILDER_STYLE_EMPTY}
            language="css"
            onChange={(value) => apply(updateNodeCss(tree, selected.id, value))}
          />
          <BuilderCodeField
            label={t.cmsBuilder.inspectorJs}
            value={selected.js || BUILDER_STYLE_EMPTY}
            language="javascript"
            onChange={(value) => apply(updateNodeJs(tree, selected.id, value))}
          />
        </>
      );
    }
    return (
      <>
        <BuilderCodeField
          label={t.cmsBuilder.pageCss}
          value={pageCode.css}
          language="css"
          onChange={(value) => {
            setPageCode({ ...pageCode, css: value });
            setSaved(false);
          }}
        />
        <BuilderCodeField
          label={t.cmsBuilder.pageJs}
          value={pageCode.js}
          language="javascript"
          onChange={(value) => {
            setPageCode({ ...pageCode, js: value });
            setSaved(false);
          }}
        />
        <Input
          label={t.cmsBuilder.scriptSrc}
          value={scriptDraft}
          onChange={(event) => setScriptDraft(event.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          disabled={!isHttpsScriptSrc(scriptDraft)}
          onClick={() => {
            const src = scriptDraft.trim();
            if (!isHttpsScriptSrc(src) || pageCode.scripts.includes(src)) {
              return;
            }
            setPageCode({ ...pageCode, scripts: [...pageCode.scripts, src] });
            setSaved(false);
            setScriptDraft(EMPTY_STRING);
          }}
        >
          {t.cmsBuilder.addScript}
        </Button>
        {pageCode.scripts.map((src) => (
          <Button
            key={src}
            size="sm"
            variant="ghost"
            onClick={() => {
              setPageCode({
                ...pageCode,
                scripts: pageCode.scripts.filter((item) => item !== src),
              });
              setSaved(false);
            }}
          >
            {src}
          </Button>
        ))}
      </>
    );
  };

  const renderLocked = () => (
    <Card padding="md">
      <Flex direction="column" gap={3}>
        <Typography variant="h4">{t.cmsBuilder.lockedTitle}</Typography>
        <Typography variant="body2">{t.cmsBuilder.lockedBody}</Typography>
        <Button
          size="sm"
          variant="primary"
          icon={<BearIcons.PackageIcon size={CMS_ICON_SIZE} />}
          onClick={() => navigate(ROUTES.CMS_EXTENSIONS)}
        >
          {t.cmsBuilder.openStore}
        </Button>
      </Flex>
    </Card>
  );

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.BUILDER}>
      <Flex direction="column" gap={6} className="bifrost-cms-builder">
        <CmsPageHeader title={t.cmsBuilder.title} subtitle={t.cmsBuilder.subtitle} />
        <BuilderBoardNiche />
        {installed ? (
          <div
            className="bifrost-cms-builder__layout"
            style={builderLayoutVars({ paletteWidth, inspectorWidth })}
          >
            <div className="bifrost-cms-builder__pane bifrost-cms-builder__pane--palette">
            <Card padding="md" className="bifrost-cms-builder__palette">
            <Flex direction="column" gap={3}>
              {selected && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearSelection}
                >
                  {t.cmsBuilder.backToWidgets}
                </Button>
              )}
              <Typography variant="h4">
                {selected ? t.cmsBuilder.inspector : t.cmsBuilder.palette}
              </Typography>
              {pageLocked && pageOwner && (
                <Alert severity="warning">
                  {t.cmsShell.pageLocked.replace('{name}', pageOwner.name)}
                </Alert>
              )}
              {!selected && (
                <Flex direction="column" gap={4}>
              <Input
                label={t.cmsBuilder.librarySearch}
                value={libraryQuery}
                onChange={(event) => setLibraryQuery(event.target.value)}
              />
              <Typography variant="caption" className="bifrost-cms__muted">
                {t.cmsBuilder.layoutHint}
              </Typography>
              <Accordion allowMultiple defaultOpen={[...PALETTE_ACCORDION_DEFAULT]}>
              {marketingGroups.map((group) => (
                <BuilderPaletteGroup key={group.id} id={group.id} label={group.label}>
                    {group.widgets.map((widget) => (
                      <BuilderWidgetChip
                        key={widget.id}
                        label={widget.label}
                        icon={paletteGroupIcon(group.id)}
                        draggable
                        onDragStart={(event) => onDragStartWidget(event, widget.id)}
                        onClick={() => addWidget(widget.id)}
                      />
                    ))}
                </BuilderPaletteGroup>
              ))}
              <BuilderPaletteGroup id={PALETTE_GROUP_ID.LAYOUT} label={t.cmsBuilder.paletteGroupLayout}>
                {LAYOUT_BLOCKS.map((block) => (
                  <BuilderWidgetChip
                    key={block.id}
                    label={block.label}
                    icon={paletteGroupIcon('layout')}
                    draggable
                    onDragStart={(event) => onDragStartLayout(event, block.id)}
                    onClick={() => addLayout(block.id)}
                  />
                ))}
                <BuilderWidgetChip
                  label={t.cmsBuilder.presetTwoColumns}
                  icon={paletteGroupIcon('layout')}
                  onClick={() => addColumns(NUMBER_TWO)}
                />
                <BuilderWidgetChip
                  label={t.cmsBuilder.presetThreeColumns}
                  icon={paletteGroupIcon('layout')}
                  onClick={() => addColumns(NUMBER_THREE)}
                />
              </BuilderPaletteGroup>
              <BuilderPaletteGroup id={PALETTE_GROUP_ID.CONTENT} label={t.cmsBuilder.paletteGroupContent}>
                {contentWidgets.map((widget) => (
                  <BuilderWidgetChip
                    key={widget.id}
                    label={widget.label}
                    icon={paletteGroupIcon('basic')}
                    draggable
                    onDragStart={(event) => onDragStartWidget(event, widget.id)}
                    onClick={() => addWidget(widget.id)}
                  />
                ))}
              </BuilderPaletteGroup>
              {bearGroups.map((group) => (
                <BuilderPaletteGroup key={group.id} id={group.id} label={group.label}>
                    {group.widgets.map((widget) => (
                      <BuilderWidgetChip
                        key={widget.id}
                        label={widget.label}
                        icon={paletteGroupIcon(group.id)}
                        draggable
                        onDragStart={(event) => onDragStartWidget(event, widget.id)}
                        onClick={() => addWidget(widget.id)}
                      />
                    ))}
                </BuilderPaletteGroup>
              ))}
              <BuilderPaletteGroup id={PALETTE_GROUP_ID.FORM} label={t.cmsBuilder.paletteGroupForm}>
                {formWidgets.map((widget) => (
                  <BuilderWidgetChip
                    key={widget.id}
                    label={widget.label}
                    icon={paletteGroupIcon('form')}
                    draggable
                    onDragStart={(event) => onDragStartWidget(event, widget.id)}
                    onClick={() => addWidget(widget.id)}
                  />
                ))}
              </BuilderPaletteGroup>
              <BuilderPaletteGroup id={PALETTE_GROUP_ID.CUSTOM} label={t.cmsBuilder.customWidget}>
                <Input
                  label={t.cmsBuilder.customWidgetLabel}
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                />
                <Input
                  label={t.cmsBuilder.customWidgetHtml}
                  value={customHtml}
                  onChange={(event) => setCustomHtml(event.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!customLabel.trim() || !customHtml.trim()}
                  onClick={addCustomWidget}
                >
                  {t.cmsBuilder.customWidgetAdd}
                </Button>
              </BuilderPaletteGroup>
              </Accordion>
              <Typography variant="h5">
                {t.cmsBuilder.layers}
              </Typography>
              {renderLayers()}
                </Flex>
              )}
              {selected && (
                <Typography variant="body2">
                  {selected.label}
                </Typography>
              )}
            </Flex>
            </Card>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="bifrost-cms-panel-resize"
              aria-label={t.cmsBuilder.palette}
              onMouseDown={onPaletteResize}
            />
            </div>
            <Card padding="md" className="bifrost-cms-builder__canvas">
              <div className="bifrost-cms-builder__toolbar">
                <Typography variant="h5">{t.cmsBuilder.canvas}</Typography>
                <div className="bifrost-cms-builder__toolbar-actions">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(ROUTES.CMS_TRANSLATIONS)}
                  >
                    {t.cmsBuilder.openTranslations}
                  </Button>
                  <Button
                    size="sm"
                    variant="ink"
                    disabled={aiBusy || pageLocked || !token}
                    onClick={() => {
                      if (!token) {
                        return;
                      }
                      setAiBusy(true);
                      setAiFailed(false);
                      void completeMarketingPage(
                        token,
                        t.cmsBuilder.generatePagePrompt,
                      ).then((result) => {
                        setAiBusy(false);
                        if (!result) {
                          setAiFailed(true);
                          return;
                        }
                        apply(result.nodes);
                        setPageCode(result.code);
                        setSaved(false);
                      });
                    }}
                  >
                    {aiBusy ? t.cmsBuilder.generatingPage : t.cmsBuilder.generatePage}
                  </Button>
                  <Button
                    size="sm"
                    variant={viewport === BUILDER_VIEWPORT.DESKTOP ? 'ink' : 'outline'}
                    icon={<BearIcons.DesktopIcon size={CMS_ICON_SIZE} />}
                    aria-label={t.cmsBuilder.viewportDesktop}
                    onClick={onViewportDesktop}
                  >
                    {t.cmsBuilder.viewportDesktop}
                  </Button>
                  <Button
                    size="sm"
                    variant={viewport === BUILDER_VIEWPORT.TABLET ? 'ink' : 'outline'}
                    icon={<BearIcons.TabletIcon size={CMS_ICON_SIZE} />}
                    aria-label={t.cmsBuilder.viewportTablet}
                    onClick={onViewportTablet}
                  >
                    {t.cmsBuilder.viewportTablet}
                  </Button>
                  <Button
                    size="sm"
                    variant={viewport === BUILDER_VIEWPORT.MOBILE ? 'ink' : 'outline'}
                    icon={<BearIcons.PhoneIcon size={CMS_ICON_SIZE} />}
                    aria-label={t.cmsBuilder.viewportMobile}
                    onClick={onViewportMobile}
                  >
                    {t.cmsBuilder.viewportMobile}
                  </Button>
                  <Button
                    size="sm"
                    variant={preview ? 'ink' : 'outline'}
                    onClick={onTogglePreview}
                  >
                    {t.cmsBuilder.previewMode}
                  </Button>
                  <Dropdown
                    placement="bottom-end"
                    trigger={
                      <Button size="sm" variant="outline" aria-label={t.cmsBuilder.targetLabel}>
                        {targetOptions.find((option) => option.value === targetId)?.label ||
                          t.cmsBuilder.scratch}
                      </Button>
                    }
                    items={targetOptions.map((option) => ({
                      key: option.value || 'scratch',
                      label: option.label,
                      onClick: () => onTargetChange(option.value),
                    }))}
                  />
                  <Dropdown
                    placement="bottom-end"
                    trigger={
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<BearIcons.SaveIcon size={CMS_ICON_SIZE} />}
                        aria-label={t.cmsBuilder.saveCanvas}
                        disabled={pageLocked}
                      >
                        {t.cmsBuilder.publish}
                      </Button>
                    }
                    items={publishItems}
                  />
                </div>
              </div>
              <div className="bifrost-cms-preview-shell">
              <div
                className={`bifrost-cms-builder__stage${stageViewportClass}${stagePreviewClass}`}
                style={stageShellVars({ viewport, previewWidth })}
                onClick={onClearStage}
                onDragOver={onStageDragOver}
                onDrop={(event) => acceptDrop(event)}
                onContextMenu={onStageContextMenu}
              >
                {pageCode.css || pageCode.js || pageCode.scripts.length > NUMBER_ZERO ? (
                  <BuilderStageRuntime
                    css={pageCode.css}
                    js={pageCode.js}
                    scripts={pageCode.scripts}
                  />
                ) : null}
                {tree.length === NUMBER_ZERO ? (
                  <Typography variant="body2">{t.cmsBuilder.empty}</Typography>
                ) : (
                  tree.map(renderNode)
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="bifrost-cms-preview-resize"
                aria-label={t.cmsBuilder.viewportLabel}
                onMouseDown={onPreviewResizeStart}
              />
              </div>
              <Flex direction="column" gap={2} className="bifrost-cms-builder__sandbox">
                <Typography variant="h5">{t.cmsBuilder.sandboxTitle}</Typography>
                {aiFailed && <Alert severity="error">{t.cmsBuilder.generateFailed}</Alert>}
                {renderCodePanel()}
              </Flex>
              {saved && (
                <Typography variant="caption" className="bifrost-cms-save-ok">
                  {t.cmsBuilder.saved}
                </Typography>
              )}
            </Card>
            <div className="bifrost-cms-builder__pane bifrost-cms-builder__pane--inspector">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="bifrost-cms-panel-resize"
              aria-label={t.cmsBuilder.inspector}
              onMouseDown={onInspectorResize}
            />
            <Card padding="md" className="bifrost-cms-builder__inspector">
              <Flex direction="column" gap={3}>
              <Typography variant="h4">
                {t.cmsBuilder.inspector}
              </Typography>
              <Tabs
                value={inspectorTab}
                defaultTab={BUILDER_INSPECTOR_TAB.CONTENT}
                variant="line"
                onChange={(tabId) => setInspectorTab(tabId as BuilderInspectorTab)}
              >
                <TabList>
                  {inspectorTabs.map((tab) => (
                    <Tab key={tab.id} id={tab.id}>
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>
                <TabPanel tabId={BUILDER_INSPECTOR_TAB.CONTENT}>
                  {selected ? (
                    <Flex direction="column" gap={2}>
                      <Input
                        label={t.cmsBuilder.inspectorLabel}
                        value={selected.label}
                        onChange={(event) =>
                          apply(updateNodeLabel(tree, selected.id, event.target.value))
                        }
                      />
                      {selected.html !== undefined && selected.kind !== CANVAS_KIND.INK && (
                        <Select
                          label={t.cmsBuilder.inspectorI18nKey}
                          options={keyOptions}
                          value={readI18nKey(selected.html || BUILDER_STYLE_EMPTY)}
                          onChange={onI18nKeyChange}
                          size="sm"
                          fullWidth
                        />
                      )}
                      <Input
                        label={t.cmsBuilder.createI18nKey}
                        value={i18nKeyDraft}
                        onChange={(event) => setI18nKeyDraft(event.target.value)}
                      />
                      <Input
                        label={t.cmsBuilder.createI18nValue}
                        value={i18nValueDraft}
                        onChange={(event) => setI18nValueDraft(event.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!i18nKeyDraft.trim()}
                        onClick={() => {
                          createKey(i18nKeyDraft, i18nValueDraft);
                          if (selected.html !== undefined) {
                            onI18nKeyChange(i18nKeyDraft.trim());
                          }
                          setI18nKeyDraft(EMPTY_STRING);
                          setI18nValueDraft(EMPTY_STRING);
                        }}
                      >
                        {t.cmsBuilder.createI18nAction}
                      </Button>
                      {htmlHasImg(selected.html) && (
                        <BuilderImageFields
                          fields={imageFields}
                          uploadLabel={t.cmsBuilder.imageUpload}
                          onChangeField={onImageFieldChange}
                          onUpload={onImageUpload}
                        />
                      )}
                      {selected.html !== undefined &&
                        selected.kind !== CANVAS_KIND.INK &&
                        !htmlHasImg(selected.html) && (
                          <Input
                            label={t.cmsBuilder.inspectorHtml}
                            value={selected.html}
                            onChange={(event) =>
                              apply(updateNodeHtml(tree, selected.id, event.target.value))
                            }
                          />
                        )}
                      <Typography variant="caption">{selected.kind}</Typography>
                    </Flex>
                  ) : (
                    renderInspectorEmpty()
                  )}
                </TabPanel>
                <TabPanel tabId={BUILDER_INSPECTOR_TAB.STYLE}>
                  {selected ? (
                    <BuilderInspectorStyle
                      selectedStyles={selectedStyles}
                      backgroundLabel={t.cmsBuilder.inspectorBackground}
                      paletteLabel={t.cmsBuilder.inspectorPalette}
                      gradientLabel={t.cmsBuilder.inspectorGradient}
                      radiusLabel={t.cmsBuilder.inspectorRadius}
                      radiusNone={t.cmsBuilder.radiusNone}
                      radiusMedium={t.cmsBuilder.radiusMedium}
                      radiusFull={t.cmsBuilder.radiusFull}
                      fieldWidthLabel={t.cmsBuilder.inspectorFieldWidth}
                      fieldWidthHint={t.cmsBuilder.inspectorFieldWidthHint}
                      suggestionsLabel={t.cmsBuilder.aiLive}
                      suggestionLabels={{ ...t.cmsBuilder.aiHints }}
                      swatchLabels={{
                        paper: t.cmsBuilder.swatchPaper,
                        ink: t.cmsBuilder.swatchInk,
                        canvas: t.cmsBuilder.swatchCanvas,
                      }}
                      styleFieldLabels={{ ...t.cmsBuilder.styleFields }}
                      onBackground={applyBackground}
                      onRadius={applyRadius}
                      onWidth={applyWidth}
                      onStyleField={applyStyleField}
                      onHint={applyHint}
                    />
                  ) : (
                    renderInspectorEmpty()
                  )}
                </TabPanel>
                <TabPanel tabId={BUILDER_INSPECTOR_TAB.CODE}>
                  <Typography variant="caption">{t.cmsBuilder.inspectorAdvancedHint}</Typography>
                </TabPanel>
              </Tabs>
              </Flex>
            </Card>
            </div>
          </div>
        ) : (
          renderLocked()
        )}
        {menu && menu.nodeId && (
          <CanvasContextMenu
            x={menu.x}
            y={menu.y}
            title={selected?.id === menu.nodeId ? selected.label : t.cmsBuilder.canvas}
            canPasteStyles={canPasteStyles}
            labels={contextMenuLabels}
            onAction={runMenu}
          />
        )}
        {menu && !menu.nodeId && (
          <Flex
            direction="column"
            className="bifrost-cms-canvas-menu"
            style={canvasMenuVars(menu.x, menu.y)}
            onClick={(event) => event.stopPropagation()}
          >
            <Button type="button" size="sm" variant="ghost" onClick={onAddBlankSection}>
              {t.cmsBuilder.menuAddSection}
            </Button>
          </Flex>
        )}
      </Flex>
    </CmsShell>
  );
};
