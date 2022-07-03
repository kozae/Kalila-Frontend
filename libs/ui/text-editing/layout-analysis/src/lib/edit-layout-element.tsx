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
import { TextElementInfoForm } from './text-element-info-form';
import { ImageElementInfoForm } from './image-element-info-form';
import {
  RegionDefinitionKeyboardInstructions,
  TextEditingWorkspaceContext,
} from '@frontend/ui/text-editing/shared';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';
import { hexToRgbUint32Array } from '@frontend/util';
import { FacsimileRegion } from '@frontend/domain';

export const EditLayoutElement = ({
  selectedElement,
}: {
  selectedElement: { Id: string | null; Region: FacsimileRegion | null };
}) => {
  const [regionUnderEditUrl, setRegionUnderEditUrl] = useState('');
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const dispatch = useAppDispatch();
  const textElement = useAppSelector((state) =>
    selectTextElementById(state, selectedElement.Id as string)
  );
  const imageElement = useAppSelector((state) =>
    selectImageElementById(state, selectedElement.Id as string)
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
    if (facsimileCropper !== null && selectedElement.Region) {
      const [p, r] = mapDataForCropper(selectedElement.Region);
      const color = hexToRgbUint32Array('#6b9e1f');
      setRegionUnderEditUrl(facsimileCropper.get_region(p, r, color));
    }
  }, [selectedElement]);

  const handleSave = useCallback(() => {
    if (textElement) {
      dispatch(
        updateTextElement({
          id: selectedElement.Id as string,
          changes: {
            FacsimileRegion: selectedElement.Region as FacsimileRegion,
            Position: position,
          },
        })
      );
    }

    if (imageElement) {
      dispatch(
        updateImageElement({
          id: selectedElement.Id as string,
          changes: {
            FacsimileRegion: selectedElement.Region as FacsimileRegion,
            Position: position,
          },
        })
      );
    }

    dispatch(onElementSelected({ Id: null, Region: null }));
  }, [selectedElement, position]);

  const handleCancel = useCallback(() => {
    if (selectedElement.Id && selectedElement.Id.length !== 24) {
      if (textElement) {
        dispatch(cancelCreateTextElement(selectedElement.Id));
      }

      if (imageElement) {
        dispatch(cancelCreateImageElement(selectedElement.Id));
      }
    }

    dispatch(onElementSelected({ Id: null, Region: null }));
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
