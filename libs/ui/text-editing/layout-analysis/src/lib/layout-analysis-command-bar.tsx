import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import { kalilaTheme } from '@frontend/shared-ui';

export const LayoutAnalysisCommandBar = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        bgcolor: 'white',
        boxShadow: kalilaTheme.shadows[4],
      }}
      justifyContent="center"
      alignItems="center"
      direction="row"
      spacing={2}
    >
      <Button
        color="secondary"
        size="small"
        startIcon={<InsertPhotoTwoToneIcon />}
        variant="text"
      >
        Add Image Element
      </Button>
      <Button
        size="small"
        startIcon={<TextSnippetTwoToneIcon />}
        variant="text"
        color="secondary"
      >
        Add Text Element
      </Button>
    </Stack>
  );
};
