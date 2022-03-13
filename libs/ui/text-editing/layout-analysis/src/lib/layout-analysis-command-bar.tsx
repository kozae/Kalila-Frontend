import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import React, { useCallback } from 'react';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import MoveUpTwoToneIcon from '@mui/icons-material/MoveUpTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { kalilaTheme } from '@frontend/shared-ui';
import * as uuid from 'uuid';
import { highlightColors } from '@frontend/ui/facsimile';
import {
  addImageElement,
  addTextElement,
  onElementSelected,
  setTextEditingToolMode,
  TextEditingToolMode,
  useAppDispatch,
} from '@frontend/ui/store';

export interface ILayoutAnalysisCommandBarProps {
  numberOfTextElements: number;
  numberOfImageElements: number;
  toolMode: TextEditingToolMode;
}

export const LayoutAnalysisCommandBar = ({
  numberOfTextElements,
  numberOfImageElements,
  toolMode,
}: ILayoutAnalysisCommandBarProps) => {
  const dispatch = useAppDispatch();
  const handleElementSelected = (id: string | null) =>
    dispatch(onElementSelected({ id, region: null }));
  const createTextElement = useCallback(() => {
    const id = uuid.v4();
    dispatch(
      addTextElement({
        _id: id,
        Position: 'main body',
        Order: numberOfTextElements + numberOfImageElements + 1,
        HighlightColor: highlightColors[(numberOfTextElements + 1) % 15],
      })
    );
    handleElementSelected(id);
  }, [numberOfTextElements]);
  const createImageElement = useCallback(() => {
    const id = uuid.v4();
    dispatch(
      addImageElement({
        _id: id,
        Position: 'image in main body',
        Order: numberOfTextElements + numberOfImageElements + 1,
        HighlightColor: highlightColors[(numberOfImageElements + 6) % 15],
      })
    );
    handleElementSelected(id);
  }, [numberOfImageElements]);
  return (
    <Stack
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
      direction="row"
      spacing={2}
    >
      {toolMode === 'default' && (
        <>
          <Button
            color="secondary"
            size="small"
            startIcon={<InsertPhotoTwoToneIcon />}
            variant="text"
            onClick={() => createImageElement()}
          >
            Define Image Element
          </Button>
          <Button
            size="small"
            startIcon={<TextSnippetTwoToneIcon />}
            variant="text"
            color="secondary"
            onClick={() => createTextElement()}
          >
            Define Text Element
          </Button>
          <Button
            size="small"
            startIcon={<MoveUpTwoToneIcon />}
            variant="text"
            color="secondary"
            onClick={() => dispatch(setTextEditingToolMode('reorder'))}
          >
            Reorder Elements
          </Button>
        </>
      )}
      {toolMode === 'reorder' && (
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => dispatch(setTextEditingToolMode('default'))}
        >
          Done
        </Button>
      )}
    </Stack>
  );
};
