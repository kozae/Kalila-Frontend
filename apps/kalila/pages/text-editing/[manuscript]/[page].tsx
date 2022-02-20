import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  queryServerSide,
  siglum,
  pages,
  pageTranscription,
  sigla,
  getImageInfo,
} from '@frontend/server-side-queries';
import Head from 'next/head';
import React from 'react';
import { TextEditingWorkspace } from '@frontend/ui/text-editing/workspace';
import { useRouter } from 'next/router';

function pageTitle(siglum: string): [string, string] {
  return ['Text Editing:', `Pages of ${siglum}`];
}

export function EditPage({
  siglum,
  manuscriptId,
  pageData,
  allPages,
  imageInfo,
}) {
  const messages = pageTitle(siglum);
  const router = useRouter();
  useNavbarMessage(messages, undefined, {
    name: 'manuscript-pages-paginator',
    data: { allPages, manuscriptId, current: pageData.Number },
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{messages.join(' ') + ` (${pageData.Number})`}</title>
      </Head>
      {/*<TextEditingWorkspace pageData={pageData} imageInfo={imageInfo} />*/}
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
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    const pageId = context.params['page'] as string;
    console.log({ manuscriptId, pageId });
    const query = await queryServerSide({
      siglum: siglum(manuscriptId),
      allPages: pages(manuscriptId),
      pageData: pageTranscription(manuscriptId, pageId),
    });
    // const imageInfo = await getImageInfo(query.pageData.FacsimileImageUrl);
    return {
      props: {
        ...query,
        // imageInfo,
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
