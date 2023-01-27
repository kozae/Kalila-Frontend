import { pages, sigla } from '@frontend/server-side-queries';
import Box from '@mui/material/Box';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const FindPage = ({ data }) => {
  const { push, query } = useRouter();
  useEffect(() => {
    const msId = query.manuscript as string;
    const pageNumber = parseInt(query.page as string);

    if (msId && pageNumber !== undefined) {
      const pageId = data[msId][pageNumber];
      if (pageId) {
        push(`/text-editing/${msId}/${pageId}`);
      }
    }
  }, [query]);

  return <Box />;
};

export default FindPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const mss = await sigla();
  const data: Record<string, Record<number, string>> = {};
  for (const ms of mss) {
    const allPages = await pages(ms.Id);
    data[ms.Id] = {};
    allPages.forEach(({ Number, Id }) => {
      data[ms.Id][Number] = Id;
    });
  }

  return {
    props: { data },
  };
};
