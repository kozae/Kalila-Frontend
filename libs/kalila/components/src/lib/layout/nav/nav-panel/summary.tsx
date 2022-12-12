import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import Typography from '@mui/material/Typography';
import { useLargeScreenMediaQuery } from '@frontend/shared-ui';

export const Summary = ({ text }: { text: string }) => {
  const isLargeScreen = useLargeScreenMediaQuery();
  return (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`${text}-content`}
      id={`${text}-content`}
    >
      <Typography
        fontSize={isLargeScreen ? '1.1rem' : '0.6rem'}
        color="secondary.main"
      >
        {text}
      </Typography>
    </AccordionSummary>
  );
};
