import { IChildrenProp } from '@frontend/shared-ui';
import { Layout, PageOptionsProvider } from '@frontend/ui/layout';
import { FC } from 'react';
import { useKalilaSession } from '../contexts';
import { siteMaxWidth, sitePadding } from './constants';
import { Nav, NavTopBarContextProvider } from './nav';

export const LayoutWrapper: FC<IChildrenProp> = ({ children }) => {
  const { authenticated, session } = useKalilaSession();
  return (
    <PageOptionsProvider>
      <NavTopBarContextProvider>
        <Layout
          nav={<Nav authenticated={authenticated} session={session}></Nav>}
          siteMaxWidth={siteMaxWidth}
          sitePadding={sitePadding}
        >
          {children}
        </Layout>
      </NavTopBarContextProvider>
    </PageOptionsProvider>
  );
};
