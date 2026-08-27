import { useEffect, type FC } from 'react';
import { useBear } from '@forgedevstack/bear';
import { CMS_PATH } from '@config/cms.config';
import { CMS_THEME_EVENT, SLASH } from '@const/index';
import { loadCmsThemeColors } from '@pages/Cms/SettingsPages/SettingsPages.utils';
import { applyCmsBearPrimary, isCmsLoginPath } from './ThemeSync.utils';
import type { ThemeSyncProps } from './ThemeSync.types';

const isCmsHost = (): boolean => {
  const path = window.location.pathname;
  return path === CMS_PATH || path.startsWith(`${CMS_PATH}${SLASH}`);
};

export const ThemeSync: FC<ThemeSyncProps> = ({ children }) => {
  const { mode, updateTheme, addVariant } = useBear();
  const isDark = mode === 'dark';

  useEffect(() => {
    if (isCmsLoginPath(window.location.pathname)) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      return;
    }
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (!isCmsHost()) return undefined;
    const applyBearTheme = () => {
      applyCmsBearPrimary(updateTheme, addVariant, loadCmsThemeColors().primary);
    };
    applyBearTheme();
    window.addEventListener(CMS_THEME_EVENT, applyBearTheme);
    return () => window.removeEventListener(CMS_THEME_EVENT, applyBearTheme);
  }, [addVariant, updateTheme]);

  return children;
};
