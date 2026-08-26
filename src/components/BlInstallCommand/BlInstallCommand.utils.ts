import { EMPTY_STRING } from '@const/strings.const';
import { NUMBER_ZERO } from '@const/numbers.const';

export const splitInstallCommand = (
  command: string,
  packageName: string,
): { prefix: string; pkg: string; suffix: string } => {
  const pkgIndex = command.indexOf(packageName);
  if (pkgIndex < NUMBER_ZERO) {
    return { prefix: command, pkg: packageName, suffix: EMPTY_STRING };
  }
  const afterPkg = pkgIndex + packageName.length;
  return {
    prefix: command.slice(0, pkgIndex),
    pkg: packageName,
    suffix: command.slice(afterPkg),
  };
};
