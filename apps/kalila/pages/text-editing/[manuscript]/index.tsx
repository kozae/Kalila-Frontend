import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import { queryServerSide, sigla, siglum } from '@frontend/server-side-queries';
import Head from 'next/head';
import React from 'react';
import { PagesSummaryPage } from '@frontend/ui/text-editing/pages-summary';

function pageTitle(siglum: string): [string, string] {
  return ['Text Editing:', `Pages of ${siglum}`];
}

export function ManuscriptPages({ siglum, manuscriptId }) {
  const messages = pageTitle(siglum);
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

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths: Array<
    string | { params: { manuscript: string }; locale?: string }
  > = [];
  const query = await queryServerSide({ sigla });
  for (const manuscript of query.sigla.filter((s) =>
    [
      'P5881',
      'A4095',
      'M486',
      'M487',
      'P3471',
      'L4044',
      'P3466',
      'P3465',
    ].includes(s.Siglum)
  )) {
    paths.push({ params: { manuscript: manuscript.Id } });
  }
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    console.log('generating pages summary page for: ', manuscriptId);
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
