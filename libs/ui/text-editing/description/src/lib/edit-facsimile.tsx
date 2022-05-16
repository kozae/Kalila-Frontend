import Stack from '@mui/material/Stack';
import React, { useCallback, useState } from 'react';
import { FileUpload } from '@frontend/ui/forms';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  NotificationBar,
  saveDescriptionChanges,
  selectPageDescription,
  selectPageFacsimileUrl,
  setImageSize,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
  useBoolean,
  useNotificationBar,
} from '@frontend/shared-ui';
import { Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFacsimileGenerator } from '@frontend/ui/facsimile-generator';
import { jpegDataUrlToFile } from '@frontend/util';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';

const UploadingIndicator = () => (
  <Box
    sx={{
      position: 'absolute',
      bgcolor: 'rgba(255,255,255, 0.7)',
      width: '100%',
      height: 'calc(100vh - 110px - 10px - 72px)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress size={180} />
  </Box>
);

export const EditFacsimile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [generated, setGenerated] = useState<string | null>(null);
  const [
    uploading,
    { setTrue: setUploadingStarted, setFalse: setUploadingFinished },
  ] = useBoolean(false);
  const url = useAppSelector(selectPageFacsimileUrl);
  const dispatch = useAppDispatch();

  const generateForm = useFormik({
    initialValues: {
      width: '200',
      height: '300',
    },
    validationSchema: Yup.object().shape({
      width: Yup.number().integer().positive().min(100).required(),
      height: Yup.number().integer().positive().min(100).required(),
    }),
    onSubmit: ({ width, height }) => {
      useFacsimileGenerator().then((generate) => {
        setGenerated(generate(parseInt(width), parseInt(height)));
      });
    },
  });
  const { message, isMessageVisible, hideMessage, notifyUser } =
    useNotificationBar();
  const value = useAppSelector(selectPageDescription);
  const handleSave = useCallback(async () => {
    setUploadingStarted();
    const file =
      generated !== null
        ? await jpegDataUrlToFile(generated, 'generated.jpg')
        : files[0];

    const url =
      generated !== null
        ? '/api/generated-facsimile-upload'
        : '/api/facsimile-upload';

    if (file) {
      const formData = new FormData();
      formData.append('theFiles', file);
      try {
        const response = await axios.post(url, formData, {
          headers: { 'content-type': 'multipart/form-data' },
        });
        const { data: link } = response.data;
        const imageSize = (await getImageSize(link)) as {
          Width: number;
          Height: number;
        };
        dispatch(saveDescriptionChanges(value.withFacsimileUrl(link)));
        dispatch(setImageSize(imageSize));
        dispatch(setTextEditingToolMode('default'));
      } catch {
        notifyUser('Upload failed', 'warning');
      } finally {
        setUploadingFinished();
      }
    }
  }, [generated, files]);

  return (
    <Stack width="80%" alignItems="center">
      {uploading && <UploadingIndicator />}
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
      <form
        style={{ width: '100%' }}
        autoComplete="off"
        onSubmit={generateForm.handleSubmit}
      >
        <Stack
          mt="10px"
          mb="10px"
          sx={{
            width: '100%',
            border: 1,
            borderRadius: 1,
            borderColor: 'rgba(0, 0, 0, 0.23)',
          }}
          alignItems="center"
        >
          {generated === null && (
            <>
              <Stack width="100%" alignItems="center">
                <Typography m="10px" variant="h4">
                  Enter the dimensions of the page in millimeters:
                </Typography>
                <TextField
                  sx={{ m: '5px' }}
                  id="width"
                  name="width"
                  label="width"
                  value={generateForm.values.width}
                  onChange={generateForm.handleChange}
                  error={
                    generateForm.touched.width &&
                    Boolean(generateForm.errors.width)
                  }
                  helperText={
                    generateForm.touched.width && generateForm.errors.width
                  }
                  variant="standard"
                />
                <TextField
                  sx={{ m: '5px' }}
                  id="height"
                  name="height"
                  label="height"
                  value={generateForm.values.height}
                  onChange={generateForm.handleChange}
                  error={
                    generateForm.touched.height &&
                    Boolean(generateForm.errors.height)
                  }
                  helperText={
                    generateForm.touched.height && generateForm.errors.height
                  }
                  variant="standard"
                />
              </Stack>
              <Box sx={{ m: '10px' }}>
                <Button
                  sx={{ typography: 'button' }}
                  variant="contained"
                  disableElevation
                  disabled={files.length > 0 || !generateForm.isValid}
                  type="submit"
                >
                  Generate
                </Button>
              </Box>
            </>
          )}
          {generated !== null && (
            <Stack alignItems="center">
              <Typography m="10px" variant="h4">
                Generated facsimile thumbnail, each square represents 5x5 mm
              </Typography>
              <img width="300" height="auto" src={generated} />
              <Button
                color="secondary"
                onClick={() => setGenerated(null)}
                startIcon={<DeleteTwoToneIcon />}
              >
                Discard
              </Button>
            </Stack>
          )}
        </Stack>
      </form>
      <FileUpload
        sx={{ width: '100%' }}
        disabled={files.length > 0 || generated !== null}
        value={files}
        maxFiles={1}
        accept={{ 'image/jpeg': ['.jpeg', '.jpg'] }}
        onChange={setFiles}
      />

      <NotificationBar
        hideMessage={hideMessage}
        isMessageVisible={isMessageVisible}
        message={message}
        messageBarType="warning"
      />
      <Stack
        width="100%"
        direction="row"
        mt="10px"
        mb="10px"
        justifyContent="space-around"
      >
        <Button
          sx={{ typography: 'button' }}
          startIcon={<SaveIcon />}
          variant="contained"
          disabled={files.length === 0 && generated === null}
          disableElevation
          onClick={() => handleSave()}
        >
          {files.length !== 0
            ? 'Save uploaded'
            : generated !== null
            ? 'Save generated'
            : 'Save'}
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

export async function getImageSize(path: string) {
  const { data } = await axios.get('/server/web/ImageSize', {
    headers: {
      Accept: 'application/json',
    },
    params: { path },
  });
  return data;
}
