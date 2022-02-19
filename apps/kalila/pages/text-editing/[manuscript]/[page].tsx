import {
  useNavbarMessage,
  useTextEditingWorkspaceStore,
  withTransition,
} from '@frontend/shared-ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  queryServerSide,
  siglum,
  pages,
  pageTranscription,
  sigla,
} from '@frontend/server-side-queries';
import Head from 'next/head';
import React from 'react';

function pageTitle(siglum: string): [string, string] {
  return ['Text Editing:', `Pages of ${siglum}`];
}

export function EditPage({ siglum, manuscriptId, pageData, allPages }) {
  const messages = pageTitle(siglum);
  useNavbarMessage(messages, undefined, {
    name: 'manuscript-pages-paginator',
    data: { allPages, manuscriptId, current: pageData.Number },
  });
  useTextEditingWorkspaceStore(pageData);
  return (
    <>
      <Head>
        <title>{messages.join(' ') + ` (${pageData.Number})`}</title>
      </Head>
      <div>
        <h1>
          {siglum}, {pageData.Number}
        </h1>
      </div>
    </>
  );
}

export default withTransition(EditPage, {});

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths: Array<
    string | { params: { manuscript: string; page: string }; locale?: string }
  > = [];
  const query = await queryServerSide({ sigla });
  for (const manuscript of query.sigla) {
    const pagesQuery = await queryServerSide({
      allPages: pages(manuscript.Id),
    });
    for (const page of pagesQuery.allPages) {
      paths.push({ params: { manuscript: manuscript.Id, page: page.Id } });
    }
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    const pageId = context.params['page'] as string;
    console.log({ manuscriptId });
    console.log({ pageId });
    const query = await queryServerSide({
      siglum: siglum(manuscriptId),
      allPages: pages(manuscriptId),
      pageData: pageTranscription(manuscriptId, pageId),
    });
    return {
      props: {
        ...query,
        manuscriptId,
      },
      revalidate: 30,
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
