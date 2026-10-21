import { CopyButton, Flex, Typography } from '@forgedevstack/bear';
import { type FC, useState } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { COPY_RESET_MS } from '@const/numbers.const';
import {
  BIFROST_ZIP_URL,
  GIT_CLONE_COMMAND,
  TAB_GIT,
  TAB_NPX,
  TAB_ZIP,
} from '@const/strings.const';
import { INSTALL_BASH_LABEL } from './BlInstallCommand.const';
import type { BlInstallCommandProps } from './BlInstallCommand.types';
import { splitInstallCommand } from './BlInstallCommand.utils';

export const BlInstallCommand: FC<BlInstallCommandProps> = (props) => {
  const { command, packageName } = props;
  const { t } = useLingo();
  const [mode, setMode] = useState<'npx' | 'git' | 'zip'>('npx');

  const activeCommand = mode === 'git' ? GIT_CLONE_COMMAND : command;
  const activePackage = mode === 'git' ? 'https://github.com/forgedevstack/bifrost.git' : packageName;
  const parts = splitInstallCommand(activeCommand, activePackage);

  return (
    <div className="Bl-install">
      <div className="Bl-install__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'npx'}
          className={`Bl-install__tab ${mode === 'npx' ? 'is-active' : ''}`}
          onClick={() => setMode('npx')}
        >
          {TAB_NPX}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'git'}
          className={`Bl-install__tab ${mode === 'git' ? 'is-active' : ''}`}
          onClick={() => setMode('git')}
        >
          {TAB_GIT}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'zip'}
          className={`Bl-install__tab ${mode === 'zip' ? 'is-active' : ''}`}
          onClick={() => setMode('zip')}
        >
          {TAB_ZIP}
        </button>
      </div>

      {mode === 'zip' ? (
        <a
          href={BIFROST_ZIP_URL}
          download="bifrost-starter.zip"
          className="Bl-install__zip-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download bifrost-starter.zip</span>
        </a>
      ) : (
        <Flex direction="column" gap={1} className="Bl-install__body">
          <Flex justify="between" align="center" className="Bl-install__top">
            <Typography variant="caption">{INSTALL_BASH_LABEL}</Typography>
            <CopyButton
              value={activeCommand}
              size="sm"
              variant="ghost"
              timeout={COPY_RESET_MS}
              copyText={t('copy')}
              copiedText={t('copied')}
              showText={false}
            />
          </Flex>
          <code className="Bl-install__cmd">
            <span>{parts.prefix}</span>
            <span className="Bl-install__pkg">{parts.pkg}</span>
            <span>{parts.suffix}</span>
          </code>
        </Flex>
      )}
    </div>
  );
};

