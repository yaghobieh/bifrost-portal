export type CatalogNode = string | { [key: string]: CatalogNode };

const isCatalogRecord = (value: CatalogNode): value is { [key: string]: CatalogNode } =>
  typeof value === 'object';

const cloneRecord = (value: object): Record<string, unknown> => {
  const next: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, entry]) => {
    next[key] = entry;
  });
  return next;
};

export const mergeCatalog = <T extends object>(base: T, overlay: CatalogNode): T => {
  if (!isCatalogRecord(overlay)) {
    return base;
  }
  const next = cloneRecord(base);
  Object.entries(overlay).forEach(([key, value]) => {
    const current = next[key];
    if (isCatalogRecord(value) && current && typeof current === 'object') {
      next[key] = mergeCatalog(current, value);
      return;
    }
    next[key] = value;
  });
  return next as T;
};
