import { useLoginValidation } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import {
  siglum,
  pages,
  pageTranscription,
  getImageSize,
} from '@frontend/server-side-queries';
import Head from 'next/head';
import { useContext, useEffect, useMemo } from 'react';
import {
  ManuscriptPagesPaginator,
  TextEditingWorkspaceWasm,
} from '@frontend/ui/text-editing/workspace';
import {
  useNavbarMessage,
  withTransition,
  NavTopBarContext,
} from '@frontend/kalila/components';

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
  useLoginValidation();
  const messages = useMemo(() => pageTitle(siglum ?? 'NotFetched'), [siglum]);

  useNavbarMessage(messages, undefined);

  const { setPageControls } = useContext(NavTopBarContext);

  useEffect(() => {
    setPageControls(
      <ManuscriptPagesPaginator
        manuscriptId={manuscriptId}
        allPages={allPages}
        current={pageData.Number}
      />
    );
  }, [pageData]);

  useEffect(() => {
    return () => {
      setPageControls(null);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{messages.join(' ') + ` (${pageData?.Number})`}</title>
      </Head>
      <TextEditingWorkspaceWasm pageData={pageData} imageSize={imageSize} />
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
        siglum: query.siglum,
        pageData: {
          ...query.pageData,
          FacsimileImageUrl: `${process.env['NEXT_PUBLIC_IMAGE_URL']}${query.pageData.FacsimileImageUrl}`,
        },
        allPages: query.allPages,
        manuscriptId,
        imageSize,
      },
    };
  } catch (err) {
    console.log({ err });
    return { notFound: true };
  }
};
