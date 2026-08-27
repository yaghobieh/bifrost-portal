import type { DragEvent, FC, MouseEvent } from 'react';
import { Button, Typography } from '@forgedevstack/bear';
import { InkEditor } from '@forgedevstack/ink';
import { cmsInkAiProps } from '@/ai/index';
import { NUMBER_TWO_HUNDRED_TWENTY } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/strings.const';
import {
  CANVAS_KIND,
  CANVAS_NODE_LABEL_CLASS,
  CANVAS_NODE_RESIZE_CLASS,
  DEFAULT_INK_FALLBACK,
} from '@pages/Cms/BuilderPages/BuilderPages.const';
import {
  applyHtmlTranslation,
  canvasNodeClassName,
  isContainerKind,
  nodeStyleObject,
} from '@pages/Cms/BuilderPages/BuilderPages.utils';
import type { CanvasNode } from '@pages/Cms/BuilderPages/BuilderPages.types';
import { useCanvasNodeResize } from '@pages/Cms/BuilderPages/hooks';
import { BuilderNodeHoverBar } from '../BuilderNodeHoverBar';
import type { BuilderCanvasNodeProps } from './BuilderCanvasNode.types';

const renderCanvasBody = (input: {
  node: CanvasNode;
  html: string;
  onHtmlChange: (id: string, html: string) => void;
}) => {
  const { node, html, onHtmlChange } = input;
  if (node.kind === CANVAS_KIND.INK) {
    return (
      <InkEditor
        value={html || DEFAULT_INK_FALLBACK}
        onChange={(next) => onHtmlChange(node.id, next)}
        colorMode="light"
        variant="document"
        minHeight={NUMBER_TWO_HUNDRED_TWENTY}
        features={{ blocks: true, slash: true, ai: true }}
        ai={cmsInkAiProps()}
      />
    );
  }
  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return null;
};

export const BuilderCanvasNode: FC<BuilderCanvasNodeProps> = (props) => {
  const {
    node,
    selectedId,
    preview,
    tree,
    duplicateLabel,
    deleteLabel,
    resizeLabel,
    apply,
    setSelectedId,
    setDropParentId,
    onContextMenu,
    onDragStartNode,
    acceptDrop,
    onDuplicate,
    onDelete,
    onHtmlChange,
    renderChild,
    localeBag,
  } = props;
  const { onResizeStart } = useCanvasNodeResize({ node, tree, apply });
  const selected = node.id === selectedId;
  const onNodeClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setSelectedId(node.id);
    setDropParentId(isContainerKind(node.kind) ? node.id : EMPTY_STRING);
  };
  const onNodeDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const onNodeDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isContainerKind(node.kind)) {
      acceptDrop(event, node.id);
      return;
    }
    acceptDrop(event, undefined, node.id);
  };
  const onNodeDragStart = (event: DragEvent<HTMLDivElement>) => {
    onDragStartNode(event, node.id);
  };
  const sourceHtml = node.html || EMPTY_STRING;
  const canvasHtml =
    node.kind === CANVAS_KIND.INK ? sourceHtml : applyHtmlTranslation(sourceHtml, localeBag);
  return (
    <div
      className={canvasNodeClassName(node.kind, selected)}
      data-node={node.id}
      style={nodeStyleObject(node.styles)}
      draggable={!preview}
      onClick={onNodeClick}
      onContextMenu={(event) => onContextMenu(event, node.id)}
      onDragStart={onNodeDragStart}
      onDragOver={onNodeDragOver}
      onDrop={onNodeDrop}
    >
      {!preview && (
        <Typography variant="caption" className={CANVAS_NODE_LABEL_CLASS}>
          {node.label}
        </Typography>
      )}
      {!preview && (
        <BuilderNodeHoverBar
          duplicateLabel={duplicateLabel}
          deleteLabel={deleteLabel}
          onDuplicate={() => onDuplicate(node.id)}
          onDelete={() => onDelete(node.id)}
        />
      )}
      {node.css && <style>{`[data-node="${node.id}"]{${node.css}}`}</style>}
      {renderCanvasBody({ node, html: canvasHtml, onHtmlChange })}
      {node.children.map(renderChild)}
      {!preview && selected && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className={CANVAS_NODE_RESIZE_CLASS}
          aria-label={resizeLabel}
          onMouseDown={onResizeStart}
        />
      )}
    </div>
  );
};
