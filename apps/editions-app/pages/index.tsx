import { GetStaticProps } from 'next';
import { editions } from '@frontend/server-side-queries';
import { orderBy } from 'lodash';
import Head from 'next/head';
import React, { useContext, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { withTransition } from '@frontend/shared-ui';
import { EditionsAppContext } from '../components';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

export function Index({ data }) {
  const { data: session, status } = useSession();
  const { setEditionName } = useContext(EditionsAppContext);
  useEffect(() => {
    setEditionName(undefined);
  }, []);

  if (status !== 'loading' && !session) {
    return (
      <Typography fontSize="2rem" padding="2rem">
        Log in to view the editions
      </Typography>
    );
  }

  return (
    <>
      <Head>
        <title>Kalila Editions</title>
      </Head>
      <Stack
        mt="10px"
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        {data &&
          data.length !== 0 &&
          data.map((ed: any) => (
            <Box sx={{ p: '1rem' }} key={ed.Id}>
              <Link
                style={{
                  textDecoration: 'none',
                }}
                href={`${ed.Id}`}
              >
                <Button disableElevation variant="outlined" color="secondary">
                  {ed.Name}
                </Button>
              </Link>
            </Box>
          ))}
      </Stack>
    </>
  );
}

export default withTransition(Index, {});

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await editions();
  return {
    props: { data: orderBy(data, 'Name') },
  };
};
