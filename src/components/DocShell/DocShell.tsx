import { useEffect, useState, type FC } from 'react';
import { Link, useRoute } from '@forgedevstack/forge-compass/react';
import { useBear } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { useLingo } from '@forgedevstack/lingo';
import { NAV_GROUPS, TOP_TABS } from '@const/nav.const';
import { PUBLIC_NAV_IDS, ROUTES } from '@const/routes.const';
import { DOCS_VERSION, GITHUB_REPO_URL, SEARCH_SHORTCUT } from '@const/strings.const';
import { searchNav } from '@data/docs.data';
import { portalNucleus, type PortalState } from '@store/portal.store';
import { BifrostMark } from '@components/BifrostMark';
import {
  DEFAULT_PUBLIC_NAV,
  fetchPublicNav,
  isPublicNavVisible,
} from '@components/PortalNav/PortalNav.utils';
import { DocShellGithubIcon, DocShellThemeIcon } from '@icons/index';
import { SearchHits } from './helpers/SearchHits';
import { DOC_SHELL_KEYDOWN } from './DocShell.const';
import {
  bindWindowKeydown,
  docShellTabClass,
  hasTocItems,
  isDocShellEscape,
  isDocShellSearchHotkey,
  tocItemClass,
  tocItemHash,
} from './DocShell.utils';
import type { DocShellProps } from './DocShell.types';

export const DocShell: FC<DocShellProps> = (props) => {
  const { children, toc, activeToc, activeTab } = props;
  const { t } = useLingo();
  const { toggleMode } = useBear();
  const route = useRoute();
  const path = route?.path ?? ROUTES.HOME;
  const portal = useNucleus(portalNucleus) as PortalState;
  const { searchOpen, searchQuery, openSearch, closeSearch, setSearchQuery } = portal;
  const [chrome, setChrome] = useState(DEFAULT_PUBLIC_NAV);

  useEffect(() => {
    void fetchPublicNav().then(setChrome);
  }, []);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (isDocShellSearchHotkey(event)) {
        event.preventDefault();
        openSearch();
      }
      if (isDocShellEscape(event)) {
        closeSearch();
      }
    };
    return bindWindowKeydown(onKey, DOC_SHELL_KEYDOWN);
  }, [openSearch, closeSearch]);

  const hits = searchNav(searchQuery, (key) => t(key as never));
  const show = (id: string): boolean => isPublicNavVisible(chrome, id);

  return (
    <div className="Bp-shell">
      <header className="Bp-nav">
        <Link to={ROUTES.HOME} className="Bp-nav__logo">
          <BifrostMark size="nav" />
          {t('brand')} {t('nav.docs')}
        </Link>
        <nav className="Bp-nav__links">
          {TOP_TABS.map(
            (tab) =>
              show(tab.id) && (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={docShellTabClass(
                    activeTab === tab.id ||
                      (!activeTab &&
                        path.startsWith(tab.path) &&
                        tab.id === PUBLIC_NAV_IDS.DOCS),
                  )}
                >
                  {t(tab.titleKey)}
                </Link>
              ),
          )}
          {show(PUBLIC_NAV_IDS.DEMO) && (
            <Link
              to={ROUTES.DEMO}
              className={docShellTabClass(path === ROUTES.DEMO)}
            >
              {t('nav.demo')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.ASK_AI) && (
            <Link
              to={ROUTES.ASK_AI}
              className={docShellTabClass(path === ROUTES.ASK_AI)}
            >
              {t('nav.askAi')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.BLOG) && (
            <Link
              to={chrome.blogPath}
              className={docShellTabClass(
                path === chrome.blogPath || path.startsWith(`${chrome.blogPath}/`),
              )}
            >
              {t('nav.blog')}
            </Link>
          )}
        </nav>
        <button type="button" className="Bp-nav__search" onClick={openSearch}>
          {t('searchPlaceholder')}
          <kbd className="Bp-nav__kbd">{SEARCH_SHORTCUT}</kbd>
        </button>
        <div className="Bp-nav__right">
          <span className="Bp-nav__pill">{DOCS_VERSION}</span>
          <a
            className="Bp-nav__icon"
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t('nav.github')}
          >
            <DocShellGithubIcon />
          </a>
          <button
            type="button"
            className="Bp-nav__icon"
            onClick={toggleMode}
            aria-label={t('nav.toggleTheme')}
          >
            <DocShellThemeIcon />
          </button>
        </div>
      </header>

      <div className="Bp-body">
        <aside className="Bp-sidebar">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              <div className="Bp-sidebar__label">{t(group.labelKey)}</div>
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  to={item.path}
                  className={path === item.path ? 'Bp-sidebar__item is-active' : 'Bp-sidebar__item'}
                >
                  {t(item.titleKey)}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <div>{children}</div>
        <aside className="Bp-toc">
          {hasTocItems(toc) && (
            <>
              <div className="Bp-toc__label">{t('onThisPage')}</div>
              {toc.map((item) => (
                <Link
                  key={item.id}
                  to={tocItemHash(item.id)}
                  className={tocItemClass(item, activeToc)}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </aside>
      </div>

      {searchOpen && (
        <div className="Bp-search" onClick={closeSearch} role="presentation">
          <div
            className="Bp-search__panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <input
              className="Bp-search__input"
              autoFocus
              value={searchQuery}
              placeholder={t('searchPlaceholder')}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <SearchHits hits={hits} empty={t('searchEmpty')} onPick={closeSearch} />
          </div>
        </div>
      )}
    </div>
  );
};
