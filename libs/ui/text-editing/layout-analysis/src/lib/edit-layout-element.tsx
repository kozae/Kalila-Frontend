import {
  onElementSelected,
  selectImageElementById,
  selectRegionDataUrlById,
  selectRegionUnderEditUrl,
  selectTextElementById,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const EditLayoutElement = ({
  selectedElementId,
}: {
  selectedElementId: string;
}) => {
  const regionUnderEditUrl = useAppSelector(selectRegionUnderEditUrl);
  const dispatch = useAppDispatch();
  const handleElementSelected = (id: string | null) =>
    dispatch(onElementSelected(id));
  const imageElement = useAppSelector(
    selectImageElementById(selectedElementId)
  );
  const textElement = useAppSelector(selectTextElementById(selectedElementId));
  const url = useAppSelector(selectRegionDataUrlById(selectedElementId));

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Typography variant="h3">Title</Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
      <Button onClick={() => handleElementSelected(null)}>Done</Button>
    </Stack>
  );
};
