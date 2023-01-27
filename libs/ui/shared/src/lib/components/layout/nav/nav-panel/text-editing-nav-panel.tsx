/* eslint-disable no-useless-catch */
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import React, { useCallback, useMemo, useState } from 'react';
import { Summary } from './summary';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';
import useSWRImmutable from 'swr/immutable';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import {
  BookId,
  MediaTypes,
  paramsSerializer,
  stringHasValue,
} from '@frontend/util';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { ApiClient } from '../../../../util';
import { useLargeScreenMediaQuery } from '../../../../hooks';

export const TextEditingNavPanel = () => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, e) => setExpanded(e)}
      sx={{ width: '100%' }}
    >
      <Summary text="Text Editing" />
      <AccordionDetails>
        <Stack>
          <PanelLink linkRef="text-editing" text="Go to: Select Manuscript" />
          <Divider sx={{ mt: '.5rem' }} />
          {expanded && <ManuscriptSelection />}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const ManuscriptRow = ({ Siglum, Id }: { Siglum: string; Id: string }) => {
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { push } = useRouter();
  const onGoClicked = useCallback(async (selectedPage: string) => {
    const value = parseInt(selectedPage);
    setLoading(true);
    try {
      const { data: pageData } = await ApiClient().get(
        `${process.env['NEXT_PUBLIC_API_URL']}Page`,
        {
          headers: {
            Accept: MediaTypes.AdminDocument,
          },
          params: { PageSize: -1, NumberEq: value, ManuscriptId: Id },
          paramsSerializer: { serialize: paramsSerializer },
        }
      );
      if (pageData.length === 0) {
        throw new Error('page does not exist');
      }
      await push(`/text-editing/${Id}/${pageData[0].Id}`);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  }, []);
  return (
    <Stack direction="row" width="100%" justifyContent="space-between">
      <PanelLink
        sx={{ p: '.5rem' }}
        linkRef={`text-editing/${Id}`}
        text={Siglum}
      />
      {loading && (
        <Box p="0.5rem" width="50%">
          <LinearProgress />
        </Box>
      )}
      {!loading && (
        <Stack direction="row">
          <input
            value={page}
            onChange={(e) => setPage(e.target.value)}
            style={{ width: '150px' }}
            type="number"
            min="1"
            step="1"
            placeholder={`${Siglum} page`}
          />
          <Button
            onClick={() => onGoClicked(page)}
            disabled={page.length === 0}
            size="small"
          >
            Go
          </Button>
        </Stack>
      )}
      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={() => setError(false)}
      >
        <Alert sx={{ width: '100%' }} severity="error">
          <Typography
            fontSize="1rem"
            variant="body1"
          >{`Page ${page} does not exist in ${Siglum}`}</Typography>
        </Alert>
      </Snackbar>
    </Stack>
  );
};

const ManuscriptSelection = () => {
  const isLargeScreen = useLargeScreenMediaQuery();

  const { data, isValidating } = useSWRImmutable('TextEditingPanelNav', () =>
    siglaFetcher()
  );

  const [filter, setFilter] = useState('');

  const items = useMemo(() => {
    return (
      data &&
      data
        .filter(
          (s: any) =>
            !stringHasValue(filter) ||
            s.Siglum.toLowerCase().startsWith(filter.toLowerCase())
        )
        .map((s: any) => (
          <ManuscriptRow key={s.Id} Siglum={s.Siglum} Id={s.Id} />
        ))
    );
  }, [filter, data]);

  return isValidating || !data ? (
    <Box p="0.5rem" width="100%">
      <LinearProgress />
    </Box>
  ) : (
    <Stack alignItems="center" mt=".5rem">
      <Box sx={{ display: 'flex', alignItems: 'flex-end', margin: '0.5rem' }}>
        <FilterAltIcon color="secondary" sx={{ mr: 1, my: 1.5 }} />
        <TextField
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
          id="siglum-filter"
          label="Siglum starts with"
          variant="filled"
        />
      </Box>
      <Stack
        p="5px"
        direction="row"
        width="100%"
        justifyContent="space-between"
      >
        <Typography
          fontSize={isLargeScreen ? '1rem' : '0.6rem'}
          color="secondary.main"
          fontWeight="bold"
        >
          Go to pages summary
        </Typography>
        <Typography
          fontSize={isLargeScreen ? '1rem' : '0.6rem'}
          color="secondary.main"
          fontWeight="bold"
        >
          Go to specific page
        </Typography>
      </Stack>
      {items}
    </Stack>
  );
};

async function siglaFetcher() {
  try {
    const { data } = await ApiClient().get<any>(
      `${process.env['NEXT_PUBLIC_API_URL']}Manuscript`,
      {
        headers: {
          Accept: MediaTypes.PartialDocument,
        },
        params: { PageSize: -1, SelectProps: 'Siglum', BookId },
        paramsSerializer: { serialize: paramsSerializer },
      }
    );
    return data.map(({ _id, Siglum }: any) => ({ Id: _id, Siglum }));
  } catch (e) {
    throw e;
  }
}
