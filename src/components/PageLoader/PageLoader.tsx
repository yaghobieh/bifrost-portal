import type { FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { BifrostMark } from '@components/BifrostMark';

export const PageLoader: FC = () => {
  const { t } = useLingo();
  return (
    <div className="Bp-page-loader" role="status" aria-live="polite" aria-label={t('docsLoading')}>
      <div className="Bp-page-loader__spin" />
      <BifrostMark size="lockup" />
    </div>
  );
};
