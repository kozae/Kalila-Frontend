import Stack from '@mui/material/Stack';
import {
  kalilaTheme,
  selectAccessToken,
  useAppSelector,
  useBoolean,
} from '@frontend/shared-ui';
import Button from '@mui/material/Button';
import { Units } from './units';
import { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import { BookUnit, IChapter } from '@frontend/domain';
import { CreateBookUnitDialog, SelectChapterDialog } from './dialogs';
import axios from 'axios';
import { TextSegmentationContext } from './context';

export const CommandBar = () => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const { updateTime, setUpdateTime } = useContext(TextSegmentationContext);
  const [
    createBookUnitDialogIsOpen,
    {
      setTrue: openCreateBookUnitDialog,
      setFalse: dismissCreateBookUnitDialog,
    },
  ] = useBoolean(false);
  const [
    selectChapterDialogIsOpen,
    { setTrue: openSelectChapterDialog, setFalse: dismissSelectChapterDialog },
  ] = useBoolean(false);
  const accessToken = useAppSelector(selectAccessToken);

  const handleSubmit = async (d: BookUnit) => {
    dismissCreateBookUnitDialog();
    await postBookUnit(d, accessToken);
    setUpdateTime(Date.now());
  };

  return (
    <>
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
        <Stack
          justifyContent="space-around"
          alignItems="center"
          direction="row"
        >
          <Button onClick={openSelectChapterDialog}>
            {chapter === null ? 'Select chapter...' : 'Change chapter...'}
          </Button>
          <Typography variant="h3">
            {chapter === null ? 'no chapter selected' : chapter.name}
          </Typography>
          <Button
            disabled={chapter === null}
            onClick={openCreateBookUnitDialog}
          >
            Create unit...
          </Button>
        </Stack>
        {chapter !== null && <Units key={updateTime} chapter={chapter} />}
      </Stack>
      {chapter !== null && (
        <CreateBookUnitDialog
          chapter={chapter}
          isOpen={createBookUnitDialogIsOpen}
          onClose={dismissCreateBookUnitDialog}
          onSubmit={handleSubmit}
        />
      )}
      <SelectChapterDialog
        isOpen={selectChapterDialogIsOpen}
        onClose={dismissSelectChapterDialog}
        onSubmit={(v) => {
          setChapter(v);
          dismissSelectChapterDialog();
        }}
      />
    </>
  );
};

async function postBookUnit(doc: any, accessToken: string | undefined) {
  await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, doc, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
