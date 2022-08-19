import React, { FC } from 'react';
import Stack from '@mui/material/Stack';
import { CHAPTERS } from '@frontend/domain';
import Button from '@mui/material/Button';

export interface ISelectChapterProps {
  chapter: string | null;
  setChapter: (v: string | null) => void;
}

export const SelectChapter: FC<ISelectChapterProps> = ({
  chapter,
  setChapter,
}) => {
  return (
    <Stack
      mt="10px"
      direction="row"
      flexWrap="wrap"
      justifyContent="space-evenly"
    >
      {CHAPTERS.map((ch) => (
        <Button
          color="secondary"
          sx={{ m: '5px', width: '230px' }}
          variant={ch.abbr === chapter ? 'contained' : 'outlined'}
          key={ch.abbr}
          onClick={() => setChapter(ch.abbr)}
        >
          ({ch.abbr}) {ch.name}
        </Button>
      ))}
    </Stack>
  );
};
