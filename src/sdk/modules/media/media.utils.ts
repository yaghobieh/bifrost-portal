import { EMPTY_STRING } from '@const/index';
import { HTML_IMG_SRC } from './media.const';

const CLOUDINARY_URL_PREFIX = 'CLOUDINARY_URL=';
const CLOUDINARY_URL_SCHEME = 'cloudinary://';

export type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

const emptyCredentials = (): CloudinaryCredentials => ({
  cloudName: EMPTY_STRING,
  apiKey: EMPTY_STRING,
  apiSecret: EMPTY_STRING,
});

export const parseCloudinaryCredentials = (raw: string): CloudinaryCredentials => {
  let value = raw.trim();
  if (!value) {
    return emptyCredentials();
  }
  if (value.toUpperCase().startsWith(CLOUDINARY_URL_PREFIX)) {
    value = value.slice(CLOUDINARY_URL_PREFIX.length).trim();
  }
  if (!value.toLowerCase().startsWith(CLOUDINARY_URL_SCHEME)) {
    return { cloudName: value, apiKey: EMPTY_STRING, apiSecret: EMPTY_STRING };
  }
  const withoutScheme = value.slice(CLOUDINARY_URL_SCHEME.length);
  const at = withoutScheme.lastIndexOf('@');
  if (at < 0) {
    return emptyCredentials();
  }
  const userInfo = withoutScheme.slice(0, at);
  const cloudName = withoutScheme
    .slice(at + 1)
    .split('/')[0]
    .split('?')[0]
    .trim();
  const colon = userInfo.indexOf(':');
  if (colon < 0) {
    return { cloudName, apiKey: userInfo, apiSecret: EMPTY_STRING };
  }
  return {
    cloudName,
    apiKey: userInfo.slice(0, colon),
    apiSecret: userInfo.slice(colon + 1),
  };
};

export const parseCloudinaryCloudName = (raw: string): string =>
  parseCloudinaryCredentials(raw).cloudName;

export const toCloudinarySrc = (src: string, cloudName: string): string => {
  if (!src || !cloudName) {
    return src;
  }
  if (src.includes('res.cloudinary.com')) {
    return src;
  }
  if (!src.startsWith('http://') && !src.startsWith('https://')) {
    return src;
  }
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto/${encodeURIComponent(src)}`;
};

export const rewriteHtmlImages = (html: string, cloudName: string): string => {
  if (!html || !cloudName) {
    return html;
  }
  return html.replace(HTML_IMG_SRC, (_match, prefix: string, quote: string, src: string) => {
    return `${prefix}${quote}${toCloudinarySrc(src, cloudName)}${quote}`;
  });
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string' && result) {
        resolve(result);
        return;
      }
      reject(new Error(EMPTY_STRING));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error(EMPTY_STRING));
    };
    reader.readAsDataURL(file);
  });
