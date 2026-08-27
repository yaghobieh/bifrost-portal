import type { ChangeEvent, FC } from 'react';
import { FileUpload, Flex, Input } from '@forgedevstack/bear';
import { BUILDER_IMAGE_ACCEPT, BUILDER_IMAGE_MAX_FILES } from '@pages/Cms/BuilderPages/BuilderPages.const';
import type { BuilderImageFieldKey, BuilderImageFieldsProps } from './BuilderImageFields.types';

export const BuilderImageFields: FC<BuilderImageFieldsProps> = (props) => {
  const { fields, uploadLabel, onChangeField, onUpload } = props;
  const onChange = (key: BuilderImageFieldKey) => (event: ChangeEvent<HTMLInputElement>) => {
    onChangeField(key, event.target.value);
  };
  const onFilesSelect = (files: File[]) => {
    const file = files[0];
    if (!file || !onUpload) {
      return;
    }
    void onUpload(file);
  };
  return (
    <Flex direction="column" gap={2} className="bifrost-cms-builder__image-fields">
      {onUpload && (
        <FileUpload
          accept={BUILDER_IMAGE_ACCEPT}
          maxFiles={BUILDER_IMAGE_MAX_FILES}
          multiple={false}
          variant="compact"
          label={uploadLabel}
          onFilesSelect={onFilesSelect}
        />
      )}
      {fields.map((field) => (
        <Input key={field.key} label={field.label} value={field.value} onChange={onChange(field.key)} />
      ))}
    </Flex>
  );
};
