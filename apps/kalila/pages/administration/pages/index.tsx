import { withAdminLayout } from '@frontend/ui/administration';
import styles from './pages.module.scss';
import { SiglumSelection, useNavbarMessage } from '@frontend/shared-ui';
import { useRouter } from 'next/router';
import { sigla } from '@frontend/server-side-queries';
import { GetStaticProps } from 'next';
import Alert from '@mui/material/Alert';
import Head from 'next/head';
import React from 'react';

export function MSSelection({ sigla }) {
  const { push } = useRouter();
  useNavbarMessage(['Administration:', 'Pages']);
  return (
    <>
      <Head>
        <title>Administration: Pages, Select Manuscript</title>
      </Head>
      <Alert severity="info" sx={{ typography: 'h3' }}>
        Click on a manuscript on which to do administrative tasks
      </Alert>
      <SiglumSelection
        sigla={sigla}
        siglumClass={styles['siglum']}
        siglaContainerClass={styles['sigla']}
        onSelect={(s) => push(`/administration/pages/${s.Id}`)}
      />
    </>
  );
}

export default withAdminLayout(MSSelection, 1);

export const getStaticProps: GetStaticProps = async (context) => {
  const query = {
    sigla: await sigla(),
  };
  return {
    props: {
      ...query,
    },
    revalidate: 30,
  };
};
