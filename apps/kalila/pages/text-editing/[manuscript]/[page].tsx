import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import {
  siglum,
  pages,
  pageTranscription,
  getImageSize,
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
  imageSize,
}) {
  const router = useRouter();

  const messages = pageTitle(siglum ?? 'NotFetched');
  useNavbarMessage(messages, undefined, {
    name: 'manuscript-pages-paginator',
    data: { allPages, manuscriptId, current: pageData.Number },
  });

  return (
    <>
      <Head>
        <title>{messages.join(' ') + ` (${pageData?.Number})`}</title>
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
    const query = {
      siglum: await siglum(manuscriptId),
      pageData: await pageTranscription(manuscriptId, pageId),
      allPages: await pages(manuscriptId),
    };
    const imageSize = await getImageSize(query.pageData.FacsimileImageUrl);

    return {
      props: {
        ...query,
        manuscriptId,
        imageSize,
      },
    };
  } catch (err) {
    console.log({ err });
    return { notFound: true };
  }
};
