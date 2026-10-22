import { useState, type FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { DeveloperPanel } from './helpers/DeveloperPanel';
import { ApiEndpointsView } from './helpers/ApiEndpointsView';
import { ComponentDocsView } from './helpers/ComponentDocsView';
import { EasyInstallView } from './helpers/EasyInstallView';

export const DeveloperPages: FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'endpoints' | 'components' | 'install' | 'system'>('endpoints');

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.DEVELOPER}>
      <Flex direction="column" gap={4}>
        <div className="flex gap-2 border-b border-gray-200 pb-2 mb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'endpoints'
                ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            REST &amp; GraphQL Endpoints
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('components')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'components'
                ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span>Bear UI Components</span>
            <span className="text-[10px] uppercase font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">bearui.com</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Easy Install &amp; Clone
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Runtime &amp; System Health
          </button>
        </div>

        {activeTab === 'endpoints' && <ApiEndpointsView />}
        {activeTab === 'components' && <ComponentDocsView />}
        {activeTab === 'install' && <EasyInstallView />}
        {activeTab === 'system' && (
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
