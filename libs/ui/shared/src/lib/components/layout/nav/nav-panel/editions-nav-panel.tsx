import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import React from 'react';
import { Summary } from './summary';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';
import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';
import { selectAccessToken, useAppSelector } from '@frontend/shared-ui';
import useSWRImmutable from 'swr/immutable';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';

export const EditionsNavPanel = () => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, e) => setExpanded(e)}
      sx={{ width: '100%' }}
    >
      <Summary text="Editions" />
      <AccordionDetails>
        <Stack>
          <PanelLink
            linkRef="editions"
            text="Go to: Select or Create Edition"
          />
          <Divider sx={{ mt: '.5rem' }} />
          {expanded && <EditionSelection />}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const EditionSelection = () => {
  const accessToken = useAppSelector(selectAccessToken);
  const { data, isValidating } = useSWRImmutable(
    accessToken && 'EditionsPanelNav',
    () => editionSummaryFetcher(accessToken)
  );

  return isValidating ? (
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

async function editionSummaryFetcher(accessToken: string | undefined) {
  const { data } = await axios.get<any>(
    `${process.env['NEXT_PUBLIC_API_URL']}Edition/Summaries`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: MediaTypes.JSON,
      },
      params: { PageSize: -1 },
      paramsSerializer,
    }
  );
  return data.map(({ Id, Name }: any) => ({ Id, Name }));
}
