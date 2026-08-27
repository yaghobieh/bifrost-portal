import type { CodeEditorLanguage } from '@forgedevstack/bear';
import { CodeEditor, Flex, Typography } from '@forgedevstack/bear';
import type { FC } from 'react';
import { BUILDER_CODE_EDITOR_FONT_SIZE, BUILDER_CODE_EDITOR_HEIGHT_PX } from '@const/numbers.const';
import { BUILDER_CODE_THEME } from './BuilderPages.const';
import type { BuilderCodeFieldProps } from './BuilderCodeField.types';

export const BuilderCodeField: FC<BuilderCodeFieldProps> = (props) => {
  const { label, value, onChange, language } = props;
  const editorLanguage: CodeEditorLanguage = language;

  return (
    <Flex direction="column" gap={1} className="bifrost-cms-code-field">
      <Typography variant="caption">{label}</Typography>
      <CodeEditor
        value={value}
        onChange={onChange}
        language={editorLanguage}
        theme={BUILDER_CODE_THEME}
        showLineNumbers
        showGutter
        highlightActiveLine
        height={BUILDER_CODE_EDITOR_HEIGHT_PX}
        fontSize={BUILDER_CODE_EDITOR_FONT_SIZE}
        className="bifrost-cms-code-field__editor"
      />
    </Flex>
  );
};
