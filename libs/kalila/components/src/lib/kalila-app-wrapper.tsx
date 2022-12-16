import { kalilaTheme } from '@frontend/shared-ui';
import { ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { FC, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { ErrorBoundary } from './error-boundary';
import { KalilaSessionProvider } from './contexts/kalila-session.context';
import { LayoutWrapper } from './layout/layout-wrapper';
import { RealmAppProvider } from '@frontend/kalila/real-app';

export const KalilaAppWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RealmAppProvider>
      <ErrorBoundary>
        <ThemeProvider theme={kalilaTheme}>
          <SWRConfig value={{ onError: (e) => console.log(e) }}>
            <KalilaSessionProvider>
              <LayoutWrapper>
                <AnimatePresence exitBeforeEnter>{children}</AnimatePresence>
              </LayoutWrapper>
            </KalilaSessionProvider>
          </SWRConfig>
        </ThemeProvider>
      </ErrorBoundary>
    </RealmAppProvider>
  );
};
