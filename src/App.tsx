import { CompassProvider, Routes } from '@forgedevstack/forge-compass/react';
import { ROUTES } from '@const/routes.const';
import { DEFAULT_DOC_SLUG, DOC_PATH } from '@const/routes.const';
import { Home } from '@pages/Home';
import { DocPage } from '@pages/DocPage';
import { ApiExplorer } from '@pages/ApiExplorer';
import { Demo } from '@pages/Demo';
import { AskAi } from '@pages/AskAi';
import { Changelog } from '@pages/Changelog';

const routes = [
  { path: ROUTES.HOME, name: 'home', component: Home },
  { path: ROUTES.DOCS, name: 'docs-index', redirect: DOC_PATH(DEFAULT_DOC_SLUG) },
  { path: ROUTES.DOCS_SLUG, name: 'docs', component: DocPage },
  { path: ROUTES.API, name: 'api', component: ApiExplorer },
  { path: ROUTES.DEMO, name: 'demo', component: Demo },
  { path: ROUTES.ASK_AI, name: 'ask-ai', component: AskAi },
  { path: ROUTES.CHANGELOG, name: 'changelog', component: Changelog },
];

export const App = () => (
  <CompassProvider routes={routes}>
    <Routes />
  </CompassProvider>
);
