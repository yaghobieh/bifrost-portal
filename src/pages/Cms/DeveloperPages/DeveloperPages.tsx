import { useState, type FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { DeveloperPanel } from './helpers/DeveloperPanel';
import { ApiEndpointsView } from './helpers/ApiEndpointsView';

export const DeveloperPages: FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'endpoints' | 'system'>('endpoints');

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.DEVELOPER}>
      <Flex direction="column" gap={4}>
        <div className="flex gap-2 border-b border-gray-200 pb-2 mb-2">
          <button
            type="button"
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer ${
              activeTab === 'endpoints'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            REST &amp; GraphQL Endpoints
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer ${
              activeTab === 'system'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Runtime &amp; System Health
          </button>
        </div>

        {activeTab === 'endpoints' ? (
          <ApiEndpointsView />
        ) : (
          <>
            <CmsPageHeader
              title={t.cmsDeveloper.title}
              subtitle={t.cmsDeveloper.subtitle}
              actionTitle={t.cmsDeveloper.runtimeGroup}
              actionBody={t.cmsDeveloper.subtitle}
            />
            <DeveloperPanel />
          </>
        )}
      </Flex>
    </CmsShell>
  );
};

