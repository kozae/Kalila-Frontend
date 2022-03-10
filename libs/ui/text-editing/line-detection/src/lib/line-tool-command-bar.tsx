import Stack from '@mui/material/Stack';
import { kalilaTheme } from '@frontend/shared-ui';
import Button from '@mui/material/Button';
import MoveUpTwoToneIcon from '@mui/icons-material/MoveUpTwoTone';
import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone';
import DeleteSweepTwoToneIcon from '@mui/icons-material/DeleteSweepTwoTone';
import React from 'react';

export const LineToolCommandBar = () => {
  return (
    <Stack
      direction="row"
      sx={{
        width: '100%',
        bgcolor: 'white',
        boxShadow: kalilaTheme.shadows[4],
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Button
        size="small"
        startIcon={<AddBoxTwoToneIcon />}
        variant="text"
        color="secondary"
      >
        Add line
      </Button>
      <Button
        size="small"
        startIcon={<DeleteSweepTwoToneIcon />}
        variant="text"
        color="warning"
      >
        Delete all lines
      </Button>
      <Button
        size="small"
        startIcon={<MoveUpTwoToneIcon />}
        variant="text"
        color="secondary"
      >
        Reorder lines
      </Button>
    </Stack>
  );
};
