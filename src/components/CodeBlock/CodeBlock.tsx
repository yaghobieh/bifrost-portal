import { COPY_RESET_MS } from '@const/numbers.const';
import { COPIED_LABEL, COPY_LABEL } from '@const/strings.const';
import { useState, type FC } from 'react';
import type { CodeBlockProps } from './CodeBlock.types';

export const CodeBlock: FC<CodeBlockProps> = (props) => {
  const { lang, source } = props;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPY_RESET_MS);
  };

  return (
    <div className="Bp-code">
      <div className="Bp-code__head">
        <span className="Bp-code__lang">{lang}</span>
        <button type="button" className="Bp-code__copy" onClick={copy}>
          {copied ? COPIED_LABEL : COPY_LABEL}
        </button>
      </div>
      <pre>{source}</pre>
    </div>
  );
};
