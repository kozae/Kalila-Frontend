import Accordion from '@mui/material/Accordion';
import React from 'react';
import { Summary } from './summary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';

export const BookAnalysisNavPanel = () => {
  return (
    <Accordion disabled sx={{ width: '100%' }}>
      <Summary text="Book Analysis (Soon!)" />
      <AccordionDetails>
        <Stack>
          <PanelLink linkRef="book-analysis" text="Select Tool" />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
