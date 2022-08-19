import {
  selectAccessToken,
  useAppSelector,
  useBoolean,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import { CreateEditionModal } from '@frontend/ui/editions';
import Head from 'next/head';
import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { fetcher, MediaTypes } from '@frontend/util';
import { Box } from '@mui/material';

export function Editions() {
  const [
    createDialogIsOpen,
    { setTrue: openCreateDialog, setFalse: closeCreateDialog },
  ] = useBoolean(false);
  useNavbarMessage(['Select Edition', undefined]);
  const accessToken = useAppSelector(selectAccessToken);
  const { data } = useSWR(
    accessToken
      ? [
          // only fetch if access token is present
          'Edition',
          accessToken,
          {},
          MediaTypes.JSON,
          {},
          '/Summaries',
        ]
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  console.log({ data });
  return (
    <>
      <Head>
        <title>Kalila Editions</title>
      </Head>
      <Stack>
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
        <Stack
          mt="10px"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          {data &&
            data.content &&
            data.content.length !== 0 &&
            data.content.map((ed: any) => (
              <Box key={ed.Id}>
                <Link href={`editions/${ed.Id}`}>{ed.Name}</Link>
              </Box>
            ))}
        </Stack>
      </Stack>
    </>
  );
}

export default withTransition(Editions, {});
