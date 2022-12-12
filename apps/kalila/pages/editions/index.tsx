import Head from 'next/head';
import { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { editions } from '@frontend/server-side-queries';
import { orderBy } from 'lodash';
import { useNavbarMessage, withTransition } from '@frontend/kalila/components';

export function Editions({ data }) {
  const messages = useMemo(
    () => ['Select Edition', undefined] as [string, string],
    []
  );
  useNavbarMessage(messages);
  return (
    <>
      <Head>
        <title>Kalila Editions</title>
      </Head>

      {/* TODO Move to kalila-components */}
      {/* <Stack>
        {user && user.Username && !user.Username.includes('guest') && (
          <Stack direction="row" spacing={0.5} sx={{ m: '10px' }}>
            <Button
              onClick={openCreateDialog}
              variant="contained"
              disableElevation
              color="secondary"
            >
              Create edition from a chapter...
            </Button>
            <Button
              disabled
              onClick={openCreateDialog}
              variant="contained"
              disableElevation
              color="secondary"
            >
              Create edition from a unit group...
            </Button>
            <Portal>
              <CreateEditionModal
                open={createDialogIsOpen}
                handleClose={closeCreateDialog}
              />
            </Portal>
          </Stack>
        )}
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
                  href={`editions/${ed.Id}`}
                >
                  <Button disableElevation variant="outlined" color="secondary">
                    {ed.Name}
                  </Button>
                </Link>
              </Box>
            ))}
        </Stack>
      </Stack> */}
    </>
  );
}

export default withTransition(Editions, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await editions();
  return {
    props: { data: orderBy(data, 'Name') },
  };
};
