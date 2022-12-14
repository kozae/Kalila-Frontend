import Accordion from '@mui/material/Accordion';
import React from 'react';
import { Summary } from './summary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';

export const ImageCycleAnalysisNavPanel = () => {
  return (
    <Accordion disabled sx={{ width: '100%' }}>
      <Summary text="Image Cycle Analysis (Soon!)" />
      <AccordionDetails>
        <Stack>
          <PanelLink linkRef="image-cycle-analysis" text="Select tool" />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
