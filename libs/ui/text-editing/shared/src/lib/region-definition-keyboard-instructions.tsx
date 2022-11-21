import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import AddIcon from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import KeyboardAltTwoToneIcon from '@mui/icons-material/KeyboardAltTwoTone';
import React, { useState } from 'react';
import { IChildrenProp } from '@frontend/shared-ui';

const KeyboardInstruction: React.FC<
  { i: string; k: string } & IChildrenProp
> = ({ children, i, k }) => (
  <Stack
    justifyContent="space-between"
    alignItems="center"
    sx={{
      width: '45%',
      m: '3px',
      pr: '3px',
      border: 'solid 2px black',
      borderRadius: '3px',
    }}
    direction="row"
    spacing={0.1}
  >
    <Stack direction="row" alignItems="center">
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          mr: '2px',
        }}
      >
        {children}
      </Box>
      <Typography variant="body1">{i}</Typography>
    </Stack>
    <Typography variant="body1">{k}</Typography>
  </Stack>
);

export const RegionDefinitionKeyboardInstructions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Accordion
      onChange={(e, expanded) => setIsExpanded(expanded)}
      sx={{ width: '100%', m: '5px' }}
    >
      <AccordionSummary
        expandIcon={<KeyboardAltTwoToneIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <Typography variant="button">
            {isExpanded ? 'Hide' : 'Show'} keyboard controls
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack justifyContent="space-between" direction="row" flexWrap="wrap">
          <KeyboardInstruction i="rotate clockwise" k="shift + R">
            <RotateRightIcon />
          </KeyboardInstruction>
          <KeyboardInstruction
            i="rotate counter-clockwise"
            k="shift + ctrl + R"
          >
            <RotateLeftIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="move right" k="shift + &rarr;">
            <KeyboardDoubleArrowRightIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="move left" k="shift + &larr;">
            <KeyboardDoubleArrowLeftIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i=" move up" k="shift + &uarr;">
            <KeyboardDoubleArrowUpIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="move down" k="shift + &darr;">
            <KeyboardDoubleArrowDownIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="shrink right" k="shift + D">
            <HorizontalRuleIcon />
            <ArrowRightIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="shrink left" k="shift + A">
            <HorizontalRuleIcon />
            <ArrowLeftIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="shrink up" k="shift  + W">
            <HorizontalRuleIcon />
            <ArrowDropUpIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="shrink down" k="shift + S">
            <HorizontalRuleIcon />
            <ArrowDropDownIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="expand right" k="shift + ctrl + D">
            <AddIcon />
            <ArrowRightIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="expand left" k="shift + ctrl + A">
            <AddIcon />
            <ArrowLeftIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="expand up" k="shift + ctrl + W">
            <AddIcon />
            <ArrowDropUpIcon />
          </KeyboardInstruction>
          <KeyboardInstruction i="expand down" k="shift + ctrl + S">
            <AddIcon />
            <ArrowDropDownIcon />
          </KeyboardInstruction>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
