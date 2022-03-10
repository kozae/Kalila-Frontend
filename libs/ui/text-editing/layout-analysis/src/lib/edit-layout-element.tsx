import {
  addDataUrl,
  cancelCreateImageElement,
  cancelCreateTextElement,
  kalilaTheme,
  onElementSelected,
  selectImageElementById,
  selectRegionUnderEditUrl,
  selectTextElementById,
  updateImageElement,
  updateTextElement,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IFacsimileRegion } from '@frontend/domain';
import { TextElementInfoForm } from './text-element-info-form';
import { ImageElementInfoForm } from './image-element-info-form';
import { RegionDefinitionKeyboardInstructions } from './region-definition-keyboard-instructions';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import { createRegionsDataUrls } from '@frontend/ui/facsimile';

export const EditLayoutElement = ({
  selectedElement,
}: {
  selectedElement: { id: string | null; region: IFacsimileRegion | null };
}) => {
  const { fabricImg } = useContext(TextEditingWorkspaceContext);
  const regionUnderEditUrl = useAppSelector(selectRegionUnderEditUrl);
  const dispatch = useAppDispatch();
  const textElement = useAppSelector((state) =>
    selectTextElementById(state, selectedElement.id as string)
  );
  const imageElement = useAppSelector((state) =>
    selectImageElementById(state, selectedElement.id as string)
  );
  const [position, setPosition] = useState<string>('');

  const title =
    textElement && textElement._id.length === 24
      ? 'Edit Text Element'
      : textElement && textElement._id.length !== 24
      ? 'Define Text Element'
      : imageElement && imageElement._id.length === 24
      ? 'Edit Image Element'
      : 'Define Image Element';

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

    const onUrlCreated = (id: string, data: string) =>
      dispatch(addDataUrl({ id, data }));

    if (fabricImg !== null) {
      console.log({ selectedElement });
      const data = {
        Id: selectedElement.id,
        HighlightColor: textElement
          ? textElement.HighlightColor
          : imageElement
          ? imageElement.HighlightColor
          : kalilaTheme.palette.primary.main,
        ...selectedElement.region,
      } as IFacsimileRegion & { Id: string; HighlightColor?: string };
      createRegionsDataUrls([data], fabricImg, onUrlCreated);
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
