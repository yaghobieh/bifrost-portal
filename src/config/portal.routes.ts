import { DEFAULT_DOC_SLUG, ROUTES } from '@const/routes.const';
import { DOC_PATH } from '@const/routes.utils';
import { Home } from '@pages/Home';
import { DocPage } from '@pages/DocPage';
import { BlogIndex } from '@pages/BlogIndex';
import { BlogPost } from '@pages/BlogPost';
import { ApiExplorer } from '@pages/ApiExplorer';
import { Demo } from '@pages/Demo';
import { AskAi } from '@pages/AskAi';
import { Changelog } from '@pages/Changelog';
import { Plans } from '@pages/Plans';
import { StatusPage } from '@pages/Status';
import { CmsPagesRoute } from '@pages/CmsPagesRoute';
import {
  BuilderPages,
  CalendarPages,
  CastPages,
  CmsLogin,
  ContentEdit,
  ContentPages,
  BlogPages,
  BlogEdit,
  CrewPages,
  Dashboard,
  DeveloperPages,
  AuditPages,
  EditorsPages,
  ExtensionsPages,
  LiveEditPages,
  MediaPages,
  NotificationsPages,
  PlansPages,
  SettingsPages,
  TasksPages,
  TemplatesPages,
  TranslationsPages,
  withCmsGate,
} from '@pages/Cms';

export const PORTAL_APP_ROUTES = [
  { path: ROUTES.HOME, name: 'home', component: Home },
  { path: ROUTES.BLOG, name: 'blog', component: BlogIndex },
  { path: ROUTES.BLOG_POST, name: 'blog-post', component: BlogPost },
  { path: ROUTES.DOCS, name: 'docs-index', redirect: DOC_PATH(DEFAULT_DOC_SLUG) },
  { path: ROUTES.DOCS_SLUG, name: 'docs', component: DocPage },
  { path: ROUTES.API, name: 'api', component: ApiExplorer },
  { path: ROUTES.DEMO, name: 'demo', component: Demo },
  { path: ROUTES.ASK_AI, name: 'ask-ai', component: AskAi },
  { path: ROUTES.CHANGELOG, name: 'changelog', component: Changelog },
  { path: ROUTES.STATUS, name: 'status', component: StatusPage },
  { path: ROUTES.PLANS, name: 'plans', component: Plans },
  { path: ROUTES.CMS_LOGIN, name: 'cms-login', component: CmsLogin },
  { path: ROUTES.CMS, name: 'cms', component: withCmsGate(Dashboard) },
  { path: ROUTES.CMS_CONTENT, name: 'cms-content', component: withCmsGate(ContentPages) },
  { path: ROUTES.CMS_BLOG, name: 'cms-blog', component: withCmsGate(BlogPages) },
  { path: ROUTES.CMS_BLOG_EDIT, name: 'cms-blog-edit', component: withCmsGate(BlogEdit) },
  { path: ROUTES.CMS_EDIT, name: 'cms-edit', component: withCmsGate(ContentEdit) },
  { path: ROUTES.CMS_MEDIA, name: 'cms-media', component: withCmsGate(MediaPages) },
  { path: ROUTES.CMS_EDITORS, name: 'cms-editors', component: withCmsGate(EditorsPages) },
  { path: ROUTES.CMS_CREW, name: 'cms-crew', component: withCmsGate(CrewPages) },
  { path: ROUTES.CMS_LIVE_EDIT, name: 'cms-live-edit', component: withCmsGate(LiveEditPages) },
  { path: ROUTES.CMS_EXTENSIONS, name: 'cms-extensions', component: withCmsGate(ExtensionsPages) },
  { path: ROUTES.CMS_PLANS, name: 'cms-plans', component: withCmsGate(PlansPages) },
  { path: ROUTES.CMS_CALENDAR, name: 'cms-calendar', component: withCmsGate(CalendarPages) },
  { path: ROUTES.CMS_TEMPLATES, name: 'cms-templates', component: withCmsGate(TemplatesPages) },
  { path: ROUTES.CMS_BUILDER, name: 'cms-builder', component: withCmsGate(BuilderPages) },
  { path: ROUTES.CMS_TRANSLATIONS, name: 'cms-translations', component: withCmsGate(TranslationsPages) },
  { path: ROUTES.CMS_CAST, name: 'cms-cast', component: withCmsGate(CastPages) },
  { path: ROUTES.CMS_SETTINGS, name: 'cms-settings', component: withCmsGate(SettingsPages) },
  { path: ROUTES.CMS_DEVELOPER, name: 'cms-developer', component: withCmsGate(DeveloperPages) },
  { path: ROUTES.CMS_AUDIT, name: 'cms-audit', component: withCmsGate(AuditPages) },
  { path: ROUTES.PAGES, name: 'pages', component: CmsPagesRoute },
  { path: ROUTES.CMS_NOTIFICATIONS, name: 'cms-notifications', component: withCmsGate(NotificationsPages) },
  { path: ROUTES.CMS_TASKS, name: 'cms-tasks', component: withCmsGate(TasksPages) },
];
