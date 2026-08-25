import { useEffect, type FC, type KeyboardEvent } from 'react';
import { Link, useRoute } from '@forgedevstack/forge-compass/react';
import { useBear } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { useLingo } from '@forgedevstack/lingo';
import { NAV_GROUPS, TOP_TABS } from '@const/nav.const';
import { ROUTES } from '@const/routes.const';
import { DOCS_VERSION, GITHUB_REPO_URL, SEARCH_SHORTCUT } from '@const/strings.const';
import { searchDocs } from '@data/docs.data';
import { portalNucleus } from '@store/portal.store';
import { BifrostMark } from '@components/BifrostMark';
import { SearchHits } from './helpers/SearchHits';
import type { DocShellProps } from './DocShell.types';

const isModK = (event: KeyboardEvent | globalThis.KeyboardEvent): boolean =>
  (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

export const DocShell: FC<DocShellProps> = (props) => {
  const { children, toc, activeToc, activeTab } = props;
  const { t } = useLingo();
  const { toggleMode } = useBear();
  const route = useRoute();
  const path = route?.path ?? ROUTES.HOME;
  const { searchOpen, searchQuery, openSearch, closeSearch, setSearchQuery } = useNucleus(portalNucleus);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (isModK(event)) {
        event.preventDefault();
        openSearch();
      }
      if (event.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch, closeSearch]);

  const hits = searchDocs(searchQuery);

  return (
    <div className="Bp-shell">
      <header className="Bp-nav">
        <Link to={ROUTES.HOME} className="Bp-nav__logo">
          <BifrostMark size="nav" />
          {t('brand')} Docs
        </Link>
        <nav className="Bp-nav__links">
          {TOP_TABS.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={activeTab === tab.id || (!activeTab && path.startsWith(tab.path) && tab.id === 'docs') ? 'Bp-nav__link is-active' : 'Bp-nav__link'}
            >
              {t(tab.titleKey)}
            </Link>
          ))}
          <Link to={ROUTES.DEMO} className={path === ROUTES.DEMO ? 'Bp-nav__link is-active' : 'Bp-nav__link'}>
            {t('nav.demo')}
          </Link>
          <Link to={ROUTES.ASK_AI} className={path === ROUTES.ASK_AI ? 'Bp-nav__link is-active' : 'Bp-nav__link'}>
            {t('nav.askAi')}
          </Link>
        </nav>
        <button type="button" className="Bp-nav__search" onClick={openSearch}>
          {t('searchPlaceholder')}
          <kbd className="Bp-nav__kbd">{SEARCH_SHORTCUT}</kbd>
        </button>
        <div className="Bp-nav__right">
          <span className="Bp-nav__pill">{DOCS_VERSION}</span>
          <a className="Bp-nav__icon" href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" aria-label={t('nav.github')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8c0 2.9 1.9 5.3 4.4 6.2.3.1.4-.1.4-.3v-1.1c-1.8.4-2.2-.8-2.2-.8-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.6 0 1 .6 1 .6.6 1 1.5.7 1.9.5.1-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.1 0-.7.2-1.2.6-1.7 0-.2-.3-.8.1-1.6 0 0 .5-.2 1.7.6.5-.1 1-.2 1.6-.2s1.1.1 1.6.2c1.2-.8 1.7-.6 1.7-.6.4.8.1 1.4.1 1.6.4.5.6 1 .6 1.7 0 2.4-1.5 2.9-2.9 3.1.2.2.5.6.5 1.2v1.8c0 .2.1.4.4.3C12.6 13.3 14.5 10.9 14.5 8c0-3.6-2.9-6.5-6.5-6.5z" fill="currentColor" />
            </svg>
          </a>
          <button type="button" className="Bp-nav__icon" onClick={toggleMode} aria-label={t('nav.toggleTheme')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5.3 2C3.5 3 2.3 5 2.3 7.2C2.3 10.5 5 13.2 8.3 13.2C10.5 13.2 12.4 12 13.5 10.3C9.7 10.8 6.5 7.6 6.5 3.8C6.5 3.1 6.7 2.5 7 2C6.4 2 5.8 1.9 5.3 2Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
            </svg>
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
          {toc && toc.length > 0 && (
            <>
              <div className="Bp-toc__label">{t('onThisPage')}</div>
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={item.id === activeToc ? 'Bp-toc__item is-active' : item.sub ? 'Bp-toc__item is-sub' : 'Bp-toc__item'}
                >
                  {item.label}
                </a>
              ))}
            </>
          )}
        </aside>
      </div>

      {searchOpen && (
        <div className="Bp-search" onClick={closeSearch} role="presentation">
          <div className="Bp-search__panel" onClick={(event) => event.stopPropagation()} role="dialog">
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
