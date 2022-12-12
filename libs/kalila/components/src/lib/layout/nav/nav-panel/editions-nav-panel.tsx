/* eslint-disable no-useless-catch */
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Summary } from './summary';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';
import { MediaTypes, paramsSerializer } from '@frontend/util';
import useSWRImmutable from 'swr/immutable';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { ApiClient } from '@frontend/kalila/rest';

export const EditionsNavPanel = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, e) => setExpanded(e)}
      sx={{ width: '100%' }}
    >
      <Summary text="Editions" />
      <AccordionDetails>
        <Stack>
          <PanelLink linkRef="editions" text="Select or Create Edition" />
          <Divider sx={{ mt: '.5rem' }} />
          {expanded && <EditionSelection />}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const EditionSelection = () => {
  const { data, isValidating } = useSWRImmutable('EditionsPanelNav', () =>
    editionSummaryFetcher()
  );

  return isValidating || data === undefined ? (
    <Box p="0.5rem" width="100%">
      <LinearProgress />
    </Box>
  ) : (
    <Stack mt=".5rem">
      {data.map((e: any) => (
        <PanelLink
          sx={{ p: '.5rem' }}
          key={e.Id}
          linkRef={`editions/${e.Id}`}
          text={e.Name}
        />
      ))}
    </Stack>
  );
};

async function editionSummaryFetcher() {
  try {
    const { data } = await ApiClient().get<any>(
      `${process.env['NEXT_PUBLIC_API_URL']}Edition/Summaries`,
      {
        headers: {
          Accept: MediaTypes.JSON,
        },
        params: { PageSize: -1 },
        paramsSerializer,
      }
    );
    return data.map(({ Id, Name }: any) => ({ Id, Name }));
  } catch (e) {
    throw e;
  }
}
