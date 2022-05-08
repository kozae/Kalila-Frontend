import {
  cancelCreateImageElement,
  cancelCreateTextElement,
  kalilaTheme,
  onElementSelected,
  selectImageElementById,
  selectTextElementById,
  updateImageElement,
  updateTextElement,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IFacsimileRegion } from '@frontend/domain';
import { TextElementInfoForm } from './text-element-info-form';
import { ImageElementInfoForm } from './image-element-info-form';
import {
  RegionDefinitionKeyboardInstructions,
  TextEditingWorkspaceContext,
} from '@frontend/ui/text-editing/shared';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';

export const EditLayoutElement = ({
  selectedElement,
}: {
  selectedElement: { id: string | null; region: IFacsimileRegion | null };
}) => {
  const [regionUnderEditUrl, setRegionUnderEditUrl] = useState('');
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const dispatch = useAppDispatch();
  const textElement = useAppSelector((state) =>
    selectTextElementById(state, selectedElement.id as string)
  );
  const imageElement = useAppSelector((state) =>
    selectImageElementById(state, selectedElement.id as string)
  );
  const [position, setPosition] = useState<string>('');

  const title =
    textElement && textElement.Id.length === 24
      ? 'Edit Text Element'
      : textElement && textElement.Id.length !== 24
      ? 'Define Text Element'
      : imageElement && imageElement.Id.length === 24
      ? 'Edit Image Element'
      : 'Define Image Element';

  useEffect(() => {
    if (facsimileCropper !== null && selectedElement.region) {
      const [p, r] = mapDataForCropper(selectedElement.region);
      setRegionUnderEditUrl(facsimileCropper.get_region(p, r));
    }
  }, [selectedElement]);

  const handleSave = useCallback(() => {
    if (textElement) {
      dispatch(
        updateTextElement({
          id: selectedElement.id as string,
          changes: {
            FacsimileRegion: selectedElement.region as IFacsimileRegion,
            Position: position,
          },
        })
      );
    }

    if (imageElement) {
      dispatch(
        updateImageElement({
          id: selectedElement.id as string,
          changes: {
            FacsimileRegion: selectedElement.region as IFacsimileRegion,
            Position: position,
          },
        })
      );
    }

    dispatch(onElementSelected({ id: null, region: null }));
  }, [selectedElement, position]);

  const handleCancel = useCallback(() => {
    if (selectedElement.id && selectedElement.id.length !== 24) {
      if (textElement) {
        dispatch(cancelCreateTextElement(selectedElement.id));
      }

      if (imageElement) {
        dispatch(cancelCreateImageElement(selectedElement.id));
      }
    }

    dispatch(onElementSelected({ id: null, region: null }));
  }, [selectedElement]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'white',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: 'secondary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          boxShadow: kalilaTheme.shadows[4],
        }}
      >
        <Typography sx={{ p: '5px' }} variant="h3">
          {title}
        </Typography>
      </Box>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mt: '5px',
          mb: '5px',
          width: '98%',
          height: '40%',
          borderRadius: '5px 5px 5px 5px',
          border: 'solid 2px ' + kalilaTheme.palette.primary.main,
        }}
      >
        <Box
          sx={{
            mt: '5px',
            width: '100%%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          {regionUnderEditUrl && (
            <img
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              width="auto"
              height="auto"
              src={regionUnderEditUrl}
              alt="region not defined"
            />
          )}
        </Box>
        <Box
          sx={{
            width: '100%',
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1">
            To adjust the region, interact using the mouse with the image on the
            left or use the keyboard commands below.
          </Typography>
        </Box>
      </Stack>
      <RegionDefinitionKeyboardInstructions />
      {textElement && (
        <TextElementInfoForm value={position} onChange={setPosition} />
      )}
      {imageElement && (
        <ImageElementInfoForm value={position} onChange={setPosition} />
      )}
      <Stack direction="row" spacing={4}>
        <Button
          disableElevation
          variant="contained"
          onClick={() => handleSave()}
        >
          Save
        </Button>
        <Button
          onClick={handleCancel}
          disableElevation
          variant="outlined"
          color="warning"
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
