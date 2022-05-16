import Stack from '@mui/material/Stack';
import React, { useState } from 'react';
import { FileUpload } from '@frontend/ui/forms';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import {
  selectPageFacsimileImageSize,
  selectPageFacsimileUrl,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

export const EditFacsimile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const url = useAppSelector(selectPageFacsimileUrl);

  const dispatch = useAppDispatch();
  return (
    <Stack width="80%" alignItems="center">
      {url && (
        <Stack direction="row" mt="10px" mb="10px" alignItems="center">
          <Typography variant="h3">
            The current page has a facsimile attached:
          </Typography>
          <Box sx={{ m: '10px' }}>
            <Button
              target="_blank"
              href={url}
              startIcon={<VisibilityTwoToneIcon />}
            >
              View
            </Button>
          </Box>
        </Stack>
      )}
      <Typography m="10px" variant="h3">
        You can generate a placeholder facsimile, or upload a JPEG file
      </Typography>
      <Stack
        m="10px"
        sx={{
          width: '100%',
          border: 1,
          borderRadius: 1,
          borderColor: 'rgba(0, 0, 0, 0.23)',
        }}
        alignItems="center"
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Typography m="10px" variant="h4">
            Enter the page dimensions in millimeter:
          </Typography>
          <TextField sx={{ m: '5px' }} label="width" variant="standard" />
          <TextField sx={{ m: '5px' }} label="height" variant="standard" />
        </Stack>
        <Box sx={{ m: '10px' }}>
          <Button
            sx={{ typography: 'button' }}
            variant="contained"
            disableElevation
            onClick={() => dispatch(setTextEditingToolMode('default'))}
          >
            Generate
          </Button>
        </Box>
      </Stack>
      <FileUpload
        sx={{ width: '100%' }}
        disabled={files.length > 0}
        value={files}
        maxFiles={1}
        accept={{ 'image/jpeg': ['.jpeg', '.jpg'] }}
        onChange={setFiles}
      />

      <Stack
        width="100%"
        direction="row"
        mt="10px"
        justifyContent="space-around"
      >
        <Button
          sx={{ typography: 'button' }}
          startIcon={<SaveIcon />}
          variant="contained"
          disableElevation
          onClick={() => dispatch(setTextEditingToolMode('default'))}
        >
          Save
        </Button>
        <Button
          sx={{ typography: 'button' }}
          variant="text"
          color="secondary"
          onClick={() => dispatch(setTextEditingToolMode('default'))}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
