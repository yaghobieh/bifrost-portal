import type { FC, ReactNode } from 'react';
import { Card, Flex, Typography } from '@forgedevstack/bear';
import { NUMBER_FOUR, NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/strings.const';
import { rewriteHtmlImages } from '@sdk/modules/media';
import { CANVAS_KIND, DIRECTION_BY_KIND, WRAP_BY_KIND } from './StageCanvas.const';
import type { CanvasNode, StageCanvasProps } from './StageCanvas.types';
import { isContainerKind, nodeColorStyle, nodeText } from './StageCanvas.utils';

const renderNode = (node: CanvasNode, cloudName: string): ReactNode => {
  const kids = node.children.map((child) => renderNode(child, cloudName));
  const colorStyle = nodeColorStyle(node.styles);
  const text = nodeText(node);
  const html = rewriteHtmlImages(node.html || EMPTY_STRING, cloudName);
  const cssBlock = node.css && <style>{`[data-node="${node.id}"]{${node.css}}`}</style>;

  if (isContainerKind(node.kind)) {
    return (
      <Flex
        key={node.id}
        direction={DIRECTION_BY_KIND[node.kind]}
        wrap={WRAP_BY_KIND[node.kind]}
        gap={NUMBER_FOUR}
        className="Bl-stage__node"
        style={colorStyle}
        data-node={node.id}
        data-kind={node.kind}
      >
        {cssBlock}
        {kids}
      </Flex>
    );
  }

  if (node.kind === CANVAS_KIND.INK) {
    return (
      <Flex
        key={node.id}
        direction={DIRECTION_BY_KIND[node.kind]}
        gap={NUMBER_FOUR}
        className="Bl-stage__node"
        style={colorStyle}
        data-node={node.id}
        data-kind={node.kind}
      >
        {cssBlock}
        {text && <Typography variant="body1">{text}</Typography>}
        {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
        {kids}
      </Flex>
    );
  }

  return (
    <Card
      key={node.id}
      className="Bl-stage__node"
      style={colorStyle}
      data-node={node.id}
      data-kind={node.kind}
    >
      {cssBlock}
      {text && <Typography variant="body1">{text}</Typography>}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
      {kids}
    </Card>
  );
};

export const StageCanvas: FC<StageCanvasProps> = (props) => {
  const { nodes, cloudName = EMPTY_STRING } = props;
  if (nodes.length === NUMBER_ZERO) {
    return null;
  }
  return (
    <Flex direction={DIRECTION_BY_KIND.section} gap={NUMBER_FOUR} className="Bl-stage">
      {nodes.map((node) => renderNode(node, cloudName))}
    </Flex>
  );
};
