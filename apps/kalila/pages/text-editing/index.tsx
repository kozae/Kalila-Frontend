import {
  SiglumSelection,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { queryServerSide, sigla } from '@frontend/server-side-queries';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Alert from '@mui/material/Alert';
import styles from './index.module.scss';
import React from 'react';

export function TextEditing({ sigla }) {
  const { push } = useRouter();
  useNavbarMessage(['Text Editing:', 'Select a Manuscript']);
  return (
    <>
      <Head>
        <title>Text Editing: Select Manuscript</title>
      </Head>
      <Alert severity="info" sx={{ typography: 'h3' }}>
        Click on a manuscript on which to load its pages
      </Alert>
      <SiglumSelection
        sigla={sigla}
        siglumClass={styles['siglum']}
        siglaContainerClass={styles['sigla']}
        onSelect={(s) => push(`/text-editing/${s.Id}`)}
      />
    </>
  );
}

export default withTransition(TextEditing, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = await queryServerSide({ sigla });
  return {
    props: {
      ...query,
    },
  };
};
