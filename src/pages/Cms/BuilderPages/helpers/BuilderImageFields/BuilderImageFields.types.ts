export type BuilderImageFieldKey = 'src' | 'alt' | 'width' | 'height' | 'loading';

export type BuilderImageField = {
  key: BuilderImageFieldKey;
  label: string;
  value: string;
};

export type BuilderImageFieldsProps = {
  fields: BuilderImageField[];
  uploadLabel?: string;
  onChangeField: (key: BuilderImageFieldKey, value: string) => void;
  onUpload?: (file: File) => Promise<void>;
};
