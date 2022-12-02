import { pageId, pages, sigla } from '@frontend/server-side-queries';
import Box from '@mui/material/Box';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';

const FindPage = ({ msId, pageId }) => {
  const { push } = useRouter();
  useEffect(() => {
    if (msId && pageId) {
      push(`/text-editing/${msId}/${pageId}`);
    }
  }, [msId, pageId]);

  return <Box />;
};

export default FindPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const mss = await sigla();
  const paths: (
    | string
    | {
        params: ParsedUrlQuery;
        locale?: string;
      }
  )[] = [];
  for (const ms of mss) {
    const allPages = await pages(ms.Id);
    paths.push(
      ...allPages.map(({ Number }) => ({
        params: { manuscript: ms.Id, pageNumber: `${Number}` },
      }))
    );
  }
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { Id } = await pageId(
      context.params.manuscript as string,
      context.params.pageNumber as string
    );
    return {
      props: {
        pageId: Id,
        msId: context.params.manuscript,
      },
    };
  } catch (e) {
    console.log(e);
  }

  return {
    props: {},
    notFound: true,
  };
};
