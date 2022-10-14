import React, { useContext, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import { CHAPTERS, IChapter } from '@frontend/domain';
import Button from '@mui/material/Button';
import { BookUnitPanelContext } from './book-unit-panel.context';

export const SelectChapter = () => {
  const [filter, setFilter] = useState<string>('');
  const { setChapter } = useContext(BookUnitPanelContext);
  return (
    <Stack width="100%">
      <Typography p="1rem" variant="h5">
        Select a Chapter:
      </Typography>
      <Stack width="100%" mt="10px" alignItems="center" justifyContent="center">
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
        <Stack
          mt="10px"
          direction="row"
          flexWrap="wrap"
          justifyContent="space-evenly"
          width="100%"
        >
          {CHAPTERS.filter(
            (ch) =>
              ch.abbr.toLowerCase().includes(filter.toLowerCase()) ||
              ch.name.toLowerCase().includes(filter.toLowerCase())
          ).map((ch) => (
            <Button
              color="secondary"
              sx={{ m: '5px', width: '45%' }}
              variant="outlined"
              key={ch.abbr}
              onClick={() => setChapter(ch)}
            >
              ({ch.abbr}) {ch.name}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
