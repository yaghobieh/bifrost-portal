import type { DocPageModel, DocSection, DocTable, CmsDocItem } from './docs.types';
import { EMPTY_STRING } from '@const/strings.const';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asString = (value: unknown): string => (typeof value === 'string' ? value : EMPTY_STRING);

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];

const mapTable = (value: unknown): DocTable | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  const headers = asStringArray(record.headers);
  const rowsRaw = record.rows;
  if (!headers.length || !Array.isArray(rowsRaw)) return undefined;
  const rows = rowsRaw.map(asStringArray);
  return { headers, rows };
};

const mapCode = (value: unknown): DocSection['code'] | undefined => {
  const record = asRecord(value);
  if (!record) return undefined;
  const lang = asString(record.lang);
  const source = asString(record.source);
  if (!lang || !source) return undefined;
  return { lang, source };
};

const mapLink = (value: unknown): DocPageModel['prev'] => {
  const record = asRecord(value);
  if (!record) return undefined;
  const slug = asString(record.slug);
  const title = asString(record.title);
  if (!slug || !title) return undefined;
  return { slug, title };
};

const mapSection = (value: unknown, index: number): DocSection | null => {
  const record = asRecord(value);
  if (!record) return null;
  const heading = asString(record.heading) || asString(record.title);
  const id = asString(record.id) || `section-${index}`;
  const paragraphs = asStringArray(record.paragraphs);
  const html = asString(record.html);
  const text = asString(record.text);
  const body = paragraphs.length ? paragraphs : html ? [html] : text ? [text] : [];
  if (!heading && !body.length) return null;
  const callout = asString(record.callout) || undefined;
  return {
    id,
    heading: heading || id,
    paragraphs: body,
    callout,
    code: mapCode(record.code),
    table: mapTable(record.table),
  };
};

export const mapCmsDoc = (item: CmsDocItem): DocPageModel => {
  const payload = item.payload ?? {};
  const sectionsRaw = payload.sections;
  const mapped = Array.isArray(sectionsRaw)
    ? sectionsRaw
        .map((section, index) => mapSection(section, index))
        .filter((section): section is DocSection => Boolean(section))
    : [];
  const html = asString(payload.html);
  const sections =
    mapped.length > 0
      ? mapped
      : html
        ? [{ id: item.slug, heading: item.title, paragraphs: [html] }]
        : [];
  return {
    slug: item.slug,
    title: item.title || asString(payload.title),
    lead: asString(payload.lead),
    crumb: asString(payload.crumb),
    sections,
    prev: mapLink(payload.prev),
    next: mapLink(payload.next),
  };
};
