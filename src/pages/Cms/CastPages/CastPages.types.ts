export type CastFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'image'
  | 'rich'
  | 'file'
  | 'background'
  | 'select';

export type CastField = {
  id: string;
  name: string;
  label: string;
  type: CastFieldType;
  required: boolean;
  emailFormat: boolean;
  min: string;
  max: string;
  options: string;
};

export type CastGroupPayload = {
  fields: CastField[];
};

export type CastPagesProps = Record<string, never>;
