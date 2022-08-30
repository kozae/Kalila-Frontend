import { FC, useEffect, useState } from 'react';
import { IChapter, IImageElement } from '@frontend/domain';
import {
  selectAccessToken,
  selectCurrentPageManuscriptId,
  updateImageElement,
  useAppDispatch,
  useAppSelector,
  useBoolean,
} from '@frontend/shared-ui';
import useSWR from 'swr';
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Portal, Typography } from '@mui/material';
import { SelectChapterDialog } from '@frontend/ui/text-editing/shared';
import { SelectUnitDialog } from './dialogs';

export const ImageUnitAssignment: FC<{ el: IImageElement }> = ({ el }) => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [
    selectChapterDialogIsOpen,
    { setTrue: openSelectChapterDialog, setFalse: dismissSelectChapterDialog },
  ] = useBoolean(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const { data: assignedUnitData } = useSWR(
    accessToken && el.DepictsUnitId,
    () =>
      axios
        .get(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit/One`, {
          params: {
            Id: el.DepictsUnitId,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => res.data)
  );

  const { data: chapterUnitData } = useSWR(accessToken && chapter, () =>
    axios
      .get(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, {
        params: {
          ChapterCn: chapter ? chapter.abbr : '',
          PageSize: -1,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
  );

  const onAssignUnit = () => {
    openSelectChapterDialog();
  };

  const onSubmitUnitUnit = (v: any) => {
    dispatch(
      updateImageElement({
        id: el.Id,
        changes: {
          DepictsUnitId: v.Id,
        },
      })
    );
    dismissSelectChapterDialog();
    setChapter(null);
  };

  return (
    <Stack p="1rem" width="100%" alignItems="center">
      {assignedUnitData && (
        <Typography variant="h2">
          ({assignedUnitData.OrderInChapter}) {assignedUnitData.Title}
        </Typography>
      )}
      <Button onClick={onAssignUnit}>
        {el.DepictsUnitId ? 'Change assigned unit' : 'Assign unit'}
      </Button>
      <Portal>
        <SelectChapterDialog
          isOpen={chapter === null && selectChapterDialogIsOpen}
          onClose={dismissSelectChapterDialog}
          onSubmit={(v) => {
            setChapter(v);
          }}
        />
        <SelectUnitDialog
          isOpen={chapter !== null && selectChapterDialogIsOpen}
          onClose={() => {
            dismissSelectChapterDialog();
            setChapter(null);
          }}
          units={chapterUnitData as any[]}
          onSubmit={(v) => {
            onSubmitUnitUnit(v);
          }}
        />
      </Portal>
    </Stack>
  );
};
