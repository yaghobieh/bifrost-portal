import { useState, type FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { COPY_RESET_MS } from '@const/numbers.const';
import { INSTALL_BASH_LABEL, INSTALL_COPY_ICON_SIZE } from './BlInstallCommand.const';
import type { BlInstallCommandProps } from './BlInstallCommand.types';
import { splitInstallCommand } from './BlInstallCommand.utils';

export const BlInstallCommand: FC<BlInstallCommandProps> = (props) => {
  const { command, packageName } = props;
  const { t } = useLingo();
  const [copied, setCopied] = useState(false);
  const parts = splitInstallCommand(command, packageName);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="Bl-install">
      <div className="Bl-install__meta">
        <span className="Bl-install__lang">{INSTALL_BASH_LABEL}</span>
        <button
          type="button"
          className="Bl-install__copy"
          aria-label={copied ? t('copied') : t('copy')}
          onClick={() => {
            void onCopy();
          }}
        >
          <svg
            width={INSTALL_COPY_ICON_SIZE}
            height={INSTALL_COPY_ICON_SIZE}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <rect x="5" y="5" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M3 11V3.5C3 2.7 3.7 2 4.5 2H11" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>
      <code className="Bl-install__cmd">
        <span>{parts.prefix}</span>
        <span className="Bl-install__pkg">{parts.pkg}</span>
        <span>{parts.suffix}</span>
      </code>
    </div>
  );
};
