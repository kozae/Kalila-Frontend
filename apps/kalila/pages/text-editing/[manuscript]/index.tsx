import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { queryServerSide, siglum } from '@frontend/server-side-queries';
import Head from 'next/head';
import React from 'react';

function pageTitle(siglum: string): [string, string] {
  return ['Text Editing:', `Pages of ${siglum}`];
}

export function ManuscriptPages({ siglum, manuscriptId }) {
  useNavbarMessage(['Text Editing:', 'Select a Manuscript']);
  const messages = pageTitle(siglum);
  useNavbarMessage(messages);
  return (
    <>
      <Head>
        <title>{messages.join(' ')}</title>
      </Head>
      <div>
        <h1>Welcome to Pages!</h1>
      </div>
    </>
  );
}

export default withTransition(ManuscriptPages, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    const query = await queryServerSide({
      siglum: siglum(manuscriptId),
    });
    return {
      props: {
        ...query,
        manuscriptId,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/404',
      },
      props: {},
    };
  }
};
