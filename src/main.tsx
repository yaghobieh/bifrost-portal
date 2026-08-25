import React from 'react';
import ReactDOM from 'react-dom/client';
import '@forgedevstack/bear/styles.css';
import '@forgedevstack/grid-table/grid-table.css';
import { BearProvider } from '@forgedevstack/bear';
import { LingoProvider } from '@forgedevstack/lingo';
import { portalLingo } from '@i18n/portalLingo';
import { App } from './App';
import { bifrostTheme, bifrostVariants } from '@config/bear-theme';
import { THEME_STORAGE_KEY } from '@const/strings.const';
import './styles/portal.css';
import './styles/landing.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BearProvider
      defaultMode="light"
      theme={bifrostTheme}
      customVariants={bifrostVariants}
      persistPreference
      storageKey={THEME_STORAGE_KEY}
    >
      <LingoProvider instance={portalLingo}>
        <App />
      </LingoProvider>
    </BearProvider>
  </React.StrictMode>,
);
