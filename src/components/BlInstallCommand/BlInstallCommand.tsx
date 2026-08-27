import { CopyButton, Flex, Typography } from '@forgedevstack/bear';
import type { FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { COPY_RESET_MS } from '@const/numbers.const';
import { INSTALL_BASH_LABEL } from './BlInstallCommand.const';
import type { BlInstallCommandProps } from './BlInstallCommand.types';
import { splitInstallCommand } from './BlInstallCommand.utils';

export const BlInstallCommand: FC<BlInstallCommandProps> = (props) => {
  const { command, packageName } = props;
  const { t } = useLingo();
  const parts = splitInstallCommand(command, packageName);

  return (
    <Flex direction="column" gap={1} className="Bl-install">
      <Flex justify="between" align="center">
        <Typography variant="caption">{INSTALL_BASH_LABEL}</Typography>
        <CopyButton
          value={command}
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
  );
};
