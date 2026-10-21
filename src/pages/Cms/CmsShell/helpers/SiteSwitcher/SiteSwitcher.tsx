import { useEffect, useRef, useState, type FC } from 'react';
import { BearIcons, Button, Flex, Typography } from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import {
  NUMBER_FOUR,
  NUMBER_FOURTEEN,
  NUMBER_SIXTEEN,
  NUMBER_TWO,
} from '@const/numbers.const';
import { useSites } from '@hooks/useSites';
import { useI18n } from '@i18n/index';
import { CMS_NAV_IDS, CMS_NAV_ROUTES } from '../../CmsShell.const';
import {
  SITE_SWITCHER_CHEVRON_SIZE,
  SITE_SWITCHER_ICON_SIZE,
  SITE_SWITCHER_TEST_ID,
} from './SiteSwitcher.const';
import type { SiteSwitcherProps } from './SiteSwitcher.types';

export const SiteSwitcher: FC<SiteSwitcherProps> = ({ token, className }) => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { sites, activeSite, activeSiteId, setActiveSiteId } = useSites(token);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  const activeLabel = activeSite?.name || t.settings.siteDefaultTitle;

  return (
    <div
      ref={menuRef}
      className={`relative inline-block ${className || ''}`}
      data-testid={SITE_SWITCHER_TEST_ID}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-2xs focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.settings.switchSite}
      >
        <BearIcons.GlobeIcon size={SITE_SWITCHER_ICON_SIZE} className="text-[#1e3a8a] shrink-0" />
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Site:</span>
        <span className="truncate max-w-[120px] font-semibold text-gray-900 dark:text-white">{activeLabel}</span>
        <BearIcons.ChevronDownIcon
          size={SITE_SWITCHER_CHEVRON_SIZE}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t.settings.tabMultiSite}
          className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
            <Typography variant="caption" className="text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-[10px] mb-0">
              {t.settings.tabMultiSite}
            </Typography>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {sites.map((site) => {
              const isSelected = site.id === activeSiteId || site.slug === activeSiteId;
              return (
                <button
                  key={site.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveSiteId(site.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Flex align="center" gap={NUMBER_TWO} className="truncate">
                    <BearIcons.GlobeIcon
                      size={NUMBER_FOURTEEN}
                      className={isSelected ? 'text-[#1e3a8a]' : 'text-gray-400'}
                    />
                    <span className="truncate">{site.name}</span>
                  </Flex>
                  {isSelected ? (
                    <BearIcons.CheckIcon size={NUMBER_FOURTEEN} className="text-[#1e3a8a] shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 px-2 pt-1.5 pb-0.5">
            <Button
              size="sm"
              variant="ghost"
              fullWidth
              onClick={() => {
                setOpen(false);
                navigate(CMS_NAV_ROUTES[CMS_NAV_IDS.SITES]);
              }}
              className="text-xs text-[#1e3a8a] hover:text-[#172554] hover:bg-blue-50 dark:hover:bg-blue-950/30 justify-center font-medium"
            >
              ＋ {t.settings.createSiteTitle}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
