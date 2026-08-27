import type { FC } from 'react';
import {
  BearIcons,
  Button,
  ColorPicker,
  Flex,
  Input,
  Typography,
} from '@forgedevstack/bear';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/strings.const';
import {
  AI_STYLE_SUGGESTIONS,
  BUILDER_ACCENT_DISPLAY,
  BUILDER_BG_SWATCHES,
  BUILDER_GRADIENT_VALUE,
  BUILDER_RADIUS_OPTIONS,
  STYLE_FIELD_KEYS,
} from '@pages/Cms/BuilderPages/BuilderPages.const';
import { BuilderColorSwatches } from '../BuilderColorSwatches';
import type { BuilderInspectorStyleProps } from './BuilderInspectorStyle.types';

export const BuilderInspectorStyle: FC<BuilderInspectorStyleProps> = (props) => {
  const {
    selectedStyles,
    backgroundLabel,
    paletteLabel,
    gradientLabel,
    radiusLabel,
    radiusNone,
    radiusMedium,
    radiusFull,
    fieldWidthLabel,
    fieldWidthHint,
    suggestionsLabel,
    suggestionLabels,
    swatchLabels,
    styleFieldLabels,
    onBackground,
    onRadius,
    onWidth,
    onStyleField,
    onHint,
  } = props;
  const radiusLabels: Record<string, string> = {
    none: radiusNone,
    medium: radiusMedium,
    full: radiusFull,
  };
  const widthValue = selectedStyles.width.replace('px', EMPTY_STRING);
  return (
    <Flex direction="column" gap={3} className="bifrost-cms-inspector-style">
      <Flex direction="column" gap={2}>
        <Typography variant="overline">{backgroundLabel}</Typography>
        <BuilderColorSwatches
          colors={BUILDER_BG_SWATCHES.map((swatch) => ({
            id: swatch.id,
            value: swatch.value,
            label: swatchLabels[swatch.id] || swatch.id,
          }))}
          selected={selectedStyles.background}
          onPick={onBackground}
        />
      </Flex>
      <Flex direction="column" gap={2}>
        <Typography variant="overline">{paletteLabel}</Typography>
        <ColorPicker
          value={selectedStyles.color || selectedStyles.background}
          presets={[...BUILDER_ACCENT_DISPLAY]}
          showInput
          showPresets
          size="sm"
          onChange={(color) => onStyleField('color', color)}
        />
      </Flex>
      <Flex direction="column" gap={2}>
        <Typography variant="overline">{gradientLabel}</Typography>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="bifrost-cms-inspector-style__gradient"
          onClick={() => onBackground(BUILDER_GRADIENT_VALUE)}
        />
        <Flex gap={2} wrap="wrap">
          {BUILDER_ACCENT_DISPLAY.map((hex) => (
            <Typography key={hex} variant="caption">
              {hex}
            </Typography>
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap={2}>
        <Typography variant="overline">{radiusLabel}</Typography>
        <Flex gap={1}>
          {BUILDER_RADIUS_OPTIONS.map((option) => (
            <Button
              key={option.id}
              size="sm"
              variant={selectedStyles.borderRadius === option.value ? 'ink' : 'outline'}
              onClick={() => onRadius(option.value)}
            >
              {radiusLabels[option.id]}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Input
        label={fieldWidthLabel}
        helperText={fieldWidthHint}
        value={widthValue}
        type="number"
        onChange={(event) => onWidth(event.target.value)}
      />
      <Flex direction="column" gap={2}>
        <Typography variant="overline">{suggestionsLabel}</Typography>
        <Flex gap={2} wrap="wrap">
          {AI_STYLE_SUGGESTIONS.map((hint) => (
            <Button
              key={hint.id}
              size="sm"
              variant="outline"
              icon={<BearIcons.StarIcon size={CMS_ICON_SIZE} />}
              onClick={() => onHint(hint.id)}
            >
              {suggestionLabels[hint.id] || hint.id}
            </Button>
          ))}
        </Flex>
      </Flex>
      {STYLE_FIELD_KEYS.map((key) => (
        <Input
          key={key}
          label={styleFieldLabels[key]}
          value={selectedStyles[key]}
          onChange={(event) => onStyleField(key, event.target.value)}
        />
      ))}
    </Flex>
  );
};
