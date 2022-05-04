import Modal from '@mui/material/Modal';
import {
  DialogHeading,
  selectAccessToken,
  useAppSelector,
  useBoolean,
} from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { BookUnit } from '@frontend/domain';
import Button from '@mui/material/Button';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { TextSegmentationContext } from '../context';

const style: SxProps = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  minWidth: '300px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

export interface IDeleteBookUnitDialogProps {
  value: BookUnit;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteBookUnitDialog = ({
  isOpen,
  onClose,
  value,
}: IDeleteBookUnitDialogProps) => {
  const accessToken = useAppSelector(selectAccessToken);
  const { setUpdateTime } = useContext(TextSegmentationContext);
  const [title, setTitle] = useState('Delete Book Unit');
  const [message, setMessage] =
    useState(`Deletion will only be successful if the unit is not assigned in
              any manuscript.`);
  const [deleting, { setTrue: setDeletingStarted, setFalse: setDeletingDone }] =
    useBoolean(false);
  const [success, { setTrue: setSuccessful, setFalse: setFailed }] =
    useBoolean(false);
  const handleDelete = async () => {
    setDeletingStarted();
    try {
      await deleteBookUnit(value.Id as string, accessToken as string);
      setDeletingDone();
      setSuccessful();
      setTitle('Unit Deleted');
      setMessage(
        `Book unit (${value?.OrderInChapter}) ${value?.Title} was successfully deleted`
      );
      setUpdateTime(Date.now());
    } catch {
      setDeletingDone();
      setFailed();
      setTitle('Delete failed');
      setMessage(
        `Book unit (${value?.OrderInChapter}) ${value?.Title} could not be deleted`
      );
    }
  };
  useEffect(() => {
    return () => {
      setFailed();
    };
  }, []);
  return (
    <Portal>
      <Modal open={isOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading
            color={success && !deleting ? 'primary' : 'warning'}
            onDismiss={onClose}
          >
            <Typography color="white" variant="h5">
              {title}
            </Typography>
          </DialogHeading>
          <Stack
            spacing={1}
            sx={{ p: '10px' }}
            alignItems="center"
            justifyContent="center"
          >
            {!deleting && <Typography variant="h5">{message}</Typography>}
            {deleting && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
            <Stack direction="row" spacing={1}>
              {!success && !deleting && (
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  disableElevation
                  color="warning"
                >
                  Attempt Deleting ({value?.OrderInChapter}) {value?.Title}
                </Button>
              )}
              <Button onClick={onClose} variant="outlined" color="secondary">
                {!success ? 'Cancel' : 'Ok'}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </Portal>
  );
};

async function deleteBookUnit(id: string, accessToken: string) {
  await axios.delete(`/server/api/v1/BookUnit`, {
    params: {
      Id: id,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
