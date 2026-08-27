import {
  ATTR_DATA_I18N,
  EMPTY_STRING,
  IMAGE_ATTR_EQ,
  IMAGE_ATTR_QUOTE,
} from '@const/strings.const';
import {
  IMAGE_OPEN_TAG,
  type ImageAttrKey,
} from './BearPalette.const';

const attrAssignment = (name: ImageAttrKey): string => `${name}${IMAGE_ATTR_EQ}`;

const attrPattern = (name: ImageAttrKey): string =>
  `${attrAssignment(name)}${IMAGE_ATTR_QUOTE}([^${IMAGE_ATTR_QUOTE}]*)${IMAGE_ATTR_QUOTE}`;

export const readImgAttr = (html: string, name: ImageAttrKey): string => {
  const match = html.match(new RegExp(attrPattern(name)));
  if (!match) {
    return EMPTY_STRING;
  }
  return match[1];
};

export const writeImgAttr = (html: string, name: ImageAttrKey, value: string): string => {
  if (new RegExp(attrAssignment(name)).test(html)) {
    return html.replace(
      new RegExp(`${attrAssignment(name)}${IMAGE_ATTR_QUOTE}[^${IMAGE_ATTR_QUOTE}]*${IMAGE_ATTR_QUOTE}`),
      `${attrAssignment(name)}${IMAGE_ATTR_QUOTE}${value}${IMAGE_ATTR_QUOTE}`,
    );
  }
  if (!html.includes(IMAGE_OPEN_TAG)) {
    return html;
  }
  return html.replace(IMAGE_OPEN_TAG, `${IMAGE_OPEN_TAG} ${name}${IMAGE_ATTR_EQ}${IMAGE_ATTR_QUOTE}${value}${IMAGE_ATTR_QUOTE}`);
};

export const htmlHasImg = (html?: string): boolean => Boolean(html && html.includes(IMAGE_OPEN_TAG));

export const readI18nKey = (html: string): string => {
  const match = html.match(
    new RegExp(
      `${ATTR_DATA_I18N}${IMAGE_ATTR_EQ}${IMAGE_ATTR_QUOTE}([^${IMAGE_ATTR_QUOTE}]*)${IMAGE_ATTR_QUOTE}`,
    ),
  );
  if (!match) {
    return EMPTY_STRING;
  }
  return match[1];
};

export const writeI18nKey = (html: string, key: string): string => {
  if (new RegExp(`${ATTR_DATA_I18N}${IMAGE_ATTR_EQ}`).test(html)) {
    return html.replace(
      new RegExp(
        `${ATTR_DATA_I18N}${IMAGE_ATTR_EQ}${IMAGE_ATTR_QUOTE}[^${IMAGE_ATTR_QUOTE}]*${IMAGE_ATTR_QUOTE}`,
      ),
      `${ATTR_DATA_I18N}${IMAGE_ATTR_EQ}${IMAGE_ATTR_QUOTE}${key}${IMAGE_ATTR_QUOTE}`,
    );
  }
  return html.replace(
    '>',
    ` ${ATTR_DATA_I18N}${IMAGE_ATTR_EQ}${IMAGE_ATTR_QUOTE}${key}${IMAGE_ATTR_QUOTE}>`,
  );
};

export const htmlHasI18n = (html?: string): boolean => Boolean(html && html.includes(ATTR_DATA_I18N));
