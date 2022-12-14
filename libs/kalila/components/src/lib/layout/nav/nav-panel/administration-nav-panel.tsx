import Accordion from '@mui/material/Accordion';
import { Summary } from './summary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import { PanelLink } from './panel-link';

export const AdministrationNavPanel = () => {
  return (
    <Accordion sx={{ width: '100%' }}>
      <Summary text="Administration" />
      <AccordionDetails>
        <Stack>
          <PanelLink linkRef="administration" text="Select Activity" />
          <br />
          <PanelLink linkRef="administration/pages" text="Pages" />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
