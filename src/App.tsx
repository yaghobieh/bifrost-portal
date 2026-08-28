import { CompassProvider, Routes } from '@forgedevstack/forge-compass/react';
import { ThemeSync } from '@components/ThemeSync';
import { AuthProvider, BifrostPremiumProvider } from '@hooks/index';
import { PORTAL_APP_ROUTES } from '@config/portal.routes';

export const App = () => (
  <ThemeSync>
    <AuthProvider>
      <BifrostPremiumProvider>
        <CompassProvider routes={PORTAL_APP_ROUTES}>
          <Routes />
        </CompassProvider>
      </BifrostPremiumProvider>
    </AuthProvider>
  </ThemeSync>
);
