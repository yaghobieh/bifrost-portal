import { NUMBER_ONE, NUMBER_ZERO } from '@const/numbers.const';
import type { PageTypeDefinition, PageTypeFieldDef } from '../ContentPages/pageTypes.types';
import { BUILDER_EMPTY_STRING } from './ContentTypeBuilder.const';

/**
 * Transforms a human readable name into a valid camelCase or kebab-case identifier.
 */
export const slugifyFieldId = (name: string): string => {
  const words = name
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, BUILDER_EMPTY_STRING)
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (words.length === NUMBER_ZERO) return BUILDER_EMPTY_STRING;

  return words
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx === NUMBER_ZERO) return lower;
      return lower.charAt(NUMBER_ZERO).toUpperCase() + lower.slice(NUMBER_ONE);
    })
    .join(BUILDER_EMPTY_STRING);
};

/**
 * Transforms a type name into a lowercase slug for collections.
 */
export const slugifyTypeId = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, BUILDER_EMPTY_STRING);
};

/**
 * Reorders a field within the fields array moving it one index up.
 */
export const moveFieldUp = (
  fields: PageTypeFieldDef[],
  fieldId: string,
): PageTypeFieldDef[] => {
  const index = fields.findIndex((f) => f.id === fieldId);
  if (index <= NUMBER_ZERO) return fields;
  const next = [...fields];
  const target = next[index];
  next[index] = next[index - NUMBER_ONE];
  next[index - NUMBER_ONE] = target;
  return next;
};

/**
 * Reorders a field within the fields array moving it one index down.
 */
export const moveFieldDown = (
  fields: PageTypeFieldDef[],
  fieldId: string,
): PageTypeFieldDef[] => {
  const index = fields.findIndex((f) => f.id === fieldId);
  if (index === -1 || index >= fields.length - NUMBER_ONE) return fields;
  const next = [...fields];
  const target = next[index];
  next[index] = next[index + NUMBER_ONE];
  next[index + NUMBER_ONE] = target;
  return next;
};

/**
 * Generates formatted JSON schema string representing the model.
 */
export const generateSchemaJson = (typeDef: PageTypeDefinition): string => {
  const attributes: Record<string, unknown> = {};

  typeDef.fields.forEach((field) => {
    const attrDef: Record<string, unknown> = {
      type: field.type,
      required: Boolean(field.required),
    };

    if (field.defaultValue) {
      attrDef.default = field.defaultValue;
    }

    if (field.description) {
      attrDef.description = field.description;
    }

    if (field.type === 'relation' && field.relationTarget) {
      attrDef.target = `api::${field.relationTarget}.${field.relationTarget}`;
    }

    if (field.type === 'component' && field.componentTarget) {
      attrDef.component = `default.${field.componentTarget}`;
    }

    attributes[field.id] = attrDef;
  });

  const schema = {
    kind: typeDef.kind || 'collection',
    collectionName: typeDef.id,
    info: {
      singularName: typeDef.id.replace(/s$/, BUILDER_EMPTY_STRING),
      pluralName: typeDef.id,
      displayName: typeDef.name,
      description: typeDef.description || BUILDER_EMPTY_STRING,
    },
    options: {
      draftAndPublish: true,
    },
    attributes,
  };

  return JSON.stringify(schema, null, 2);
};
