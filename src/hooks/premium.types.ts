import type { ReactNode } from 'react';
import type { InkPremiumConfig } from '@forgedevstack/ink';

export interface BifrostPremiumContextValue {
  active: boolean;
  licenseKey: string | null;
  premium: InkPremiumConfig | undefined;
  activate: (licenseKey?: string) => string;
  clear: () => void;
}

export interface BifrostPremiumProviderProps {
  children: ReactNode;
}

export type InkPremiumContextValue = BifrostPremiumContextValue;
export type InkPremiumProviderProps = BifrostPremiumProviderProps;
