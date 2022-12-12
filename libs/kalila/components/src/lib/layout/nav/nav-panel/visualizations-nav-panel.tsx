import Accordion from '@mui/material/Accordion';
import React from 'react';
import { Summary } from './summary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';

export const VisualizationsNavPanel = () => {
  return (
    <Accordion disabled sx={{ width: '100%' }}>
      <Summary text="Visualizations (Soon!)" />
      <AccordionDetails>
        <Stack>
          <PanelLink linkRef="visualization" text="Select Visualization" />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
