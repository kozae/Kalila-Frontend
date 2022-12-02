import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { siglum } from '@frontend/server-side-queries';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { PagesSummaryPage } from '@frontend/ui/text-editing/pages-summary';

function pageTitle(siglum: string): [string, string] {
  return ['Text Editing:', `Pages of ${siglum}`];
}

export function ManuscriptPages({ siglum, manuscriptId }) {
  const messages = useMemo(() => pageTitle(siglum), [siglum]);
  useNavbarMessage(messages);
  return (
    <>
      <Head>
        <title>{messages.join(' ')}</title>
      </Head>
      <PagesSummaryPage manuscript={manuscriptId} />
    </>
  );
}

export default withTransition(ManuscriptPages, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    console.log('generating pages summary page for: ', manuscriptId);
    const query = {
      siglum: await siglum(manuscriptId),
    };
    return {
      props: {
        ...query,
        manuscriptId,
      },
    };
  } catch (err) {
    console.log({ err });
    return {
      notFound: true,
    };
  }
};
