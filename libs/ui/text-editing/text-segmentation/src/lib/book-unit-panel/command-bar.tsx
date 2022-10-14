import Stack from '@mui/material/Stack';
import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { kalilaTheme } from '@frontend/shared-ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import { BookUnitPanelContext } from './book-unit-panel.context';

export const CommandBar = () => {
  const { chapter, setChapter, filter, setFilter, setCreateUnitDialogOpen } =
    useContext(BookUnitPanelContext);
  return (
    <Stack
      width="100%"
      boxShadow={kalilaTheme.shadows[4]}
      bgcolor="white"
      zIndex={10}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="0"
    >
      <Button
        color="secondary"
        size="small"
        startIcon={<ArrowBackIcon />}
        onClick={() => setChapter(null)}
      >
        Change chapter
      </Button>
      <Typography
        m="5px"
        bgcolor="primary.dark"
        color="white"
        borderRadius="5px"
        p="5px"
        fontWeight="bold"
        variant="body1"
      >
        {chapter?.name}
      </Typography>
      <TextField
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FilterAltTwoToneIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
      />
      <Button
        onClick={() => setCreateUnitDialogOpen(true)}
        size="small"
        color="secondary"
        startIcon={<AddBoxIcon />}
      >
        Create unit ...
      </Button>
    </Stack>
  );
};
