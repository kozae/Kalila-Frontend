import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
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
import React from 'react';

const KeyboardInstruction: React.FC<{ i: string; k: string }> = ({
  children,
  i,
  k,
}) => (
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

export const RegionDefinitionKeyboardInstructions = () => (
  <Alert sx={{ width: '100%' }} severity="info">
    <AlertTitle>Keyboard controls</AlertTitle>
    <Stack justifyContent="space-between" direction="row" flexWrap="wrap">
      <KeyboardInstruction i="rotate clockwise" k="ctrl + R + &rarr;">
        <RotateRightIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="rotate counter-clockwise" k="ctrl + R + &larr;">
        <RotateLeftIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="expand right" k="ctrl + E + &rarr;">
        <ArrowRightIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="expand left" k="ctrl + E + &larr;">
        <ArrowLeftIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="expand upwards" k="ctrl + E + &uarr;">
        <ArrowDropUpIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="expand downwards" k="ctrl + E + &darr;">
        <ArrowDropDownIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="move right" k="ctrl + M + &rarr;">
        <KeyboardDoubleArrowRightIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="move left" k="ctrl + M + &larr;">
        <KeyboardDoubleArrowLeftIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i=" move upwards" k="ctrl + M + &uarr;">
        <KeyboardDoubleArrowUpIcon />
      </KeyboardInstruction>
      <KeyboardInstruction i="move downwards" k="ctrl + M + &darr;">
        <KeyboardDoubleArrowDownIcon />
      </KeyboardInstruction>
    </Stack>
  </Alert>
);
