import Stack from '@mui/material/Stack';
import { kalilaTheme } from '@frontend/shared-ui';
import Button from '@mui/material/Button';
import { Units } from './units';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { CHAPTERS, IChapter } from '@frontend/domain';

export const CommandBar = () => {
  const [chapter, setChapter] = useState<IChapter | null>(CHAPTERS[1]);
  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: '100%',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
        pb: '5px',
      }}
    >
      <Stack justifyContent="space-around" alignItems="center" direction="row">
        <Button>
          {chapter === null ? 'Select chapter...' : 'Change chapter...'}
        </Button>
        <Typography variant="h3">
          {chapter === null ? 'no chapter selected' : chapter.name}
        </Typography>
        <Button>Create unit...</Button>
      </Stack>
      <Units chapter={chapter} />
    </Stack>
  );
};
