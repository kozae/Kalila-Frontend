import { withTransition } from '@frontend/shared-ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import { edition, editions } from '@frontend/server-side-queries';
import React, { useContext, useEffect } from 'react';
import { EditionsAppContext } from '../components';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import { KalilaEditionContainer } from '@frontend/kalila/components';
import { useSession } from 'next-auth/react';

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
  return {
    props: { data },
  };
};
