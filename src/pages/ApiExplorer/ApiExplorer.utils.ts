import { API_THEME_DARK, API_THEME_LIGHT } from './ApiExplorer.const';
import type { ApiExplorerThemeMode, ApiExplorerThemeParams } from './ApiExplorer.types';

export const apiExplorerThemeMode = (params: ApiExplorerThemeParams): ApiExplorerThemeMode => {
  const { mode } = params;
  if (mode === API_THEME_LIGHT) {
    return API_THEME_LIGHT;
  }
  return API_THEME_DARK;
};
