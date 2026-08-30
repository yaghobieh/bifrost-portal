import type { CastField } from '@pages/Cms/CastPages/CastPages.types';

export type CastValueInputProps = {
  field: CastField;
  value: string;
  label: string;
  onValueChange: (name: string, value: string) => void;
};
