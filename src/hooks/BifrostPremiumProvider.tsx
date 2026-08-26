import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
} from 'react';
import {
  isInkPremiumLicenseKey,
  mintInkPremiumLicenseKey,
} from '@forgedevstack/ink';
import { PREMIUM_LICENSE_STORAGE_KEY } from './premium.const';
import type { BifrostPremiumContextValue, BifrostPremiumProviderProps } from './premium.types';

const BifrostPremiumContext = createContext<BifrostPremiumContextValue | null>(null);

const readStoredLicense = (): string | null => {
  try {
    const value = localStorage.getItem(PREMIUM_LICENSE_STORAGE_KEY);
    return isInkPremiumLicenseKey(value ?? undefined) ? value : null;
  } catch {
    return null;
  }
};

const writeStoredLicense = (licenseKey: string | null) => {
  try {
    if (licenseKey) localStorage.setItem(PREMIUM_LICENSE_STORAGE_KEY, licenseKey);
    else localStorage.removeItem(PREMIUM_LICENSE_STORAGE_KEY);
  } catch {
    return;
  }
};

export const BifrostPremiumProvider: FC<BifrostPremiumProviderProps> = ({ children }) => {
  const [licenseKey, setLicenseKey] = useState<string | null>(() => readStoredLicense());

  const activate = useCallback((incoming?: string) => {
    const next =
      incoming && isInkPremiumLicenseKey(incoming) ? incoming.trim() : mintInkPremiumLicenseKey();
    writeStoredLicense(next);
    setLicenseKey(next);
    return next;
  }, []);

  const clear = useCallback(() => {
    writeStoredLicense(null);
    setLicenseKey(null);
  }, []);

  const value = useMemo<BifrostPremiumContextValue>(() => {
    const active = Boolean(licenseKey);
    return {
      active,
      licenseKey,
      premium: active && licenseKey ? { licenseKey } : undefined,
      activate,
      clear,
    };
  }, [activate, clear, licenseKey]);

  return <BifrostPremiumContext.Provider value={value}>{children}</BifrostPremiumContext.Provider>;
};

export const useBifrostPremium = (): BifrostPremiumContextValue => {
  const ctx = useContext(BifrostPremiumContext);
  if (!ctx) {
    throw new Error('useBifrostPremium must be used within BifrostPremiumProvider');
  }
  return ctx;
};


export const InkPremiumProvider = BifrostPremiumProvider;
export const useInkPremium = useBifrostPremium;
