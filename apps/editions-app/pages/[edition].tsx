import { withTransition } from '@frontend/shared-ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import { edition, editions, postToLera } from '@frontend/server-side-queries';
import { useContext, useEffect } from 'react';
import { EditionsAppContext } from '../components';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import { KalilaEditionContainer } from '@frontend/kalila/components';
import { useSession } from 'next-auth/react';
import { transformToLERADocuments } from '@frontend/util';

export function Edition({ data }) {
  const { data: session, status } = useSession();
  const { showNavbar, setEditionName, setShowNavbar } =
    useContext(EditionsAppContext);
  useEffect(() => {
    setEditionName(data?.Name);
  }, [data]);

  if (status !== 'loading' && !session) {
    return (
      <Typography fontSize="2rem" padding="2rem">
        Log in to view the editions
      </Typography>
    );
  }
  return status !== 'loading' && data ? (
    <>
      <Head>
        <title>{data.Name}</title>
      </Head>

      <KalilaEditionContainer
        key={data?.Name}
        {...{
          data,
          username: 'guest',
          showNavbar,
          setShowNavbar,
          disableMaxWidth: () => {},
          enableMaxWidth: () => {},
          realTime: {},
        }}
      />
    </>
  ) : (
    <h1>Loading</h1>
  );
}

export default withTransition(Edition, {});

export const getStaticPaths: GetStaticPaths = async () => {
  const editionIds = await editions();
  return {
    paths: editionIds.map(({ Id }) => ({ params: { edition: Id } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await edition(context.params['edition'] as string);
  console.log('building edition');
  console.log(data.Name);
  console.log(data.BookUnits.length);
  console.log(data.Manuscripts.length);
  try {
    const leraDocs = transformToLERADocuments(data);
    await postToLera(leraDocs);
    console.log('posted to lera');
  } catch (error) {
    console.log('could not post to lera', { error });
  }
  return {
    props: { data },
  };
};
