import React from 'react';
import { Provider } from 'react-native-paper';

import { PickingProvider } from '../screens/Picking/PickingContext';
import { ReplenishmentProvider } from '../screens/Replenishment/ReplenishmentContext';
import Theme from '../utils/Theme';
import { ScanFlashProvider } from './ScanFlash';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider theme={Theme}>
      <ScanFlashProvider>
        <PickingProvider>
          <ReplenishmentProvider>{children}</ReplenishmentProvider>
        </PickingProvider>
      </ScanFlashProvider>
    </Provider>
  );
}
