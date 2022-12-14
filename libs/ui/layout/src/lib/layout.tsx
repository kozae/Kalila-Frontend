import styles from './layout.module.scss';
import { ReactNode } from 'react';
import { usePageOptions } from './page-options.context';
import { IChildrenProp } from '@frontend/shared-ui';

export interface ILayoutProps {
  nav: ReactNode;
  siteMaxWidth: string;
  sitePadding: string;
}

export const Layout: React.FC<IChildrenProp & ILayoutProps> = ({
  children,
  nav,
  siteMaxWidth,
  sitePadding,
}) => {
  const { maxWidthEnabled } = usePageOptions();
  return (
    <>
      {nav}
      <div className={styles['kalila']}>
        <main
          style={{
            maxWidth: maxWidthEnabled ? '100%' : siteMaxWidth,
            padding: maxWidthEnabled ? '0' : sitePadding,
          }}
          className={styles['main']}
        >
          {children}
        </main>
      </div>
    </>
  );
};
