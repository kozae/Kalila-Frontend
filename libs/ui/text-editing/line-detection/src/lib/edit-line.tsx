import { IFacsimileRegion } from '@frontend/domain';
import {
  cancelCreateLine,
  kalilaTheme,
  onElementSelected,
  selectLineById,
  updateLine,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  RegionDefinitionKeyboardInstructions,
  TextEditingWorkspaceContext,
} from '@frontend/ui/text-editing/shared';
import Button from '@mui/material/Button';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';
import { hexToRgbUint32Array } from '@frontend/util';

export const EditLine = ({
  selectedLine,
}: {
  selectedLine: { id: string | null; region: IFacsimileRegion | null };
}) => {
  const dispatch = useAppDispatch();
  const [regionUnderEditUrl, setRegionUnderEditUrl] = useState('');
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const line = useAppSelector((state) =>
    selectLineById(state, selectedLine.id as string)
  );
  const title = line && line.Id.length === 24 ? 'Edit Line' : 'Define Line';

  useEffect(() => {
    if (facsimileCropper !== null && selectedLine.region) {
      const [p, r] = mapDataForCropper(selectedLine.region);
      const color = hexToRgbUint32Array('#6b9e1f');
      setRegionUnderEditUrl(facsimileCropper.get_region(p, r, color));
    }
  }, [selectedLine]);

  const handleSave = useCallback(() => {
    dispatch(
      updateLine({
        id: selectedLine.id as string,
        changes: {
          FacsimileRegion: selectedLine.region as IFacsimileRegion,
        },
      })
    );
    dispatch(onElementSelected({ id: null, region: null }));
  }, [selectedLine]);

  const handleCancel = useCallback(() => {
    if (
      selectedLine.id &&
      selectedLine.id.length !== 24 &&
      !selectedLine.id.startsWith('generated')
    ) {
      dispatch(cancelCreateLine(selectedLine.id));
    }

    dispatch(onElementSelected({ id: null, region: null }));
  }, [selectedLine]);

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
      <Stack direction="row" spacing={4}>
        <Button disableElevation variant="contained" onClick={handleSave}>
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
