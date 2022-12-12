import { kalilaTheme } from '@frontend/shared-ui';
import { ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { FC, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { SignalrProvider } from './contexts/signalr.wrapper';
import { ErrorBoundary } from './error-boundary';
import { useApiCallErrorHandler } from '@frontend/kalila/rest';
import { KalilaSessionProvider } from './contexts/kalila-session.context';
import { LayoutWrapper } from './layout/layout-wrapper';

export const KalilaAppWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SignalrProvider>
      <ErrorBoundary>
        <ThemeProvider theme={kalilaTheme}>
          <SWRConfig value={{ onError: useApiCallErrorHandler() }}>
            <KalilaSessionProvider>
              <LayoutWrapper>
                <AnimatePresence exitBeforeEnter>{children}</AnimatePresence>
              </LayoutWrapper>
            </KalilaSessionProvider>
          </SWRConfig>
        </ThemeProvider>
      </ErrorBoundary>
    </SignalrProvider>
  );
};
