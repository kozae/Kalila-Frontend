import Accordion from '@mui/material/Accordion';
import React from 'react';
import { Summary } from './summary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';

export const ManuscriptDescriptionNavPanel = () => {
  return (
    <Accordion disabled sx={{ width: '100%' }}>
      <Summary text="Manuscript Description (Soon!)" />
      <AccordionDetails>
        <Stack>
          <PanelLink
            linkRef="manuscript-description"
            text="Description Summary"
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
