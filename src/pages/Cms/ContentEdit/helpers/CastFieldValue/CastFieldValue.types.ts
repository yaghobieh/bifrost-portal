import type { CastField } from '@pages/Cms/CastPages/CastPages.types';

export type CastFieldValueProps = {
  field: CastField;
  value: string;
  valueLabel: string;
  onValueChange: (name: string, value: string) => void;
};
