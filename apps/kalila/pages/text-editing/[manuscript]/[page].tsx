import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import {
  getImageSize,
  pages,
  pageTranscription,
  queryServerSide,
  siglum,
} from '@frontend/server-side-queries';
import Head from 'next/head';
import React from 'react';
import { TextEditingWorkspace } from '@frontend/ui/text-editing/workspace';

function pageTitle(siglum: string): [string, string] {
  return ['Text Editing:', `Pages of ${siglum}`];
}

export function EditPage({
  siglum,
  manuscriptId,
  pageData,
  allPages,
  imageSize,
}) {
  const messages = pageTitle(siglum);
  useNavbarMessage(messages, undefined, {
    name: 'manuscript-pages-paginator',
    data: { allPages, manuscriptId, current: pageData.Number },
  });

  return (
    <>
      <Head>
        <title>{messages.join(' ') + ` (${pageData.Number})`}</title>
      </Head>
      <TextEditingWorkspace pageData={pageData} imageSize={imageSize} />
    </>
  );
}

export default withTransition(EditPage, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const manuscriptId = context.params['manuscript'] as string;
  const pageId = context.params['page'] as string;
  try {
    const query = await queryServerSide({
      siglum: siglum(manuscriptId),
      allPages: pages(manuscriptId),
      pageData: pageTranscription(manuscriptId, pageId),
    });
    const imageSize = await getImageSize(query.pageData.FacsimileImageUrl);
    console.log({ manuscriptId, pageId });
    console.log({ imageSize });
    return {
      props: {
        ...query,
        imageSize,
        manuscriptId,
      },
    };
  } catch (err) {
    console.log({ err });
    return { notFound: true };
  }
};
