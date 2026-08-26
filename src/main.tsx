import { createRoot } from 'react-dom/client';
import '@forgedevstack/bear/styles.css';
import '@forgedevstack/ink/styles.css';
import '@forgedevstack/grid-table/grid-table.css';
import '@forgedevstack/calendar/styles.css';
import { BearProvider } from '@forgedevstack/bear';
import { LingoProvider } from '@forgedevstack/lingo';
import { I18nProvider } from '@i18n/index';
import { portalLingo } from '@i18n/portalLingo';
import { bifrostTheme, bifrostVariants } from '@config/bear-theme';
import { CMS_PATH } from '@config/cms.config';
import { SLASH, THEME_STORAGE_KEY } from '@const/strings.const';
import { App } from './App';
import './styles/index.css';
import './styles/cms.css';

const cmsPath = window.location.pathname;
const onCmsHost = cmsPath === CMS_PATH || cmsPath.startsWith(`${CMS_PATH}${SLASH}`);

if (onCmsHost) {
  document.documentElement.classList.add('bifrost-cms-host');
} else {
  void import('./styles/portal.css');
  void import('./styles/landing.css');
}

const app = (
  <I18nProvider>
    <App />
  </I18nProvider>
);

createRoot(document.getElementById('root')!).render(
  <BearProvider
    defaultMode="light"
    persistPreference
    storageKey={THEME_STORAGE_KEY}
    theme={bifrostTheme}
    customVariants={bifrostVariants}
  >
    {onCmsHost ? app : <LingoProvider instance={portalLingo}>{app}</LingoProvider>}
  </BearProvider>,
);
