import Modal from '@mui/material/Modal';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';

import { useCallback, useEffect, useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { BookUnit } from '@frontend/domain';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { bookUnitOrderDisplay, useBoolean } from '@frontend/util';
import { useDataMethods } from '../../contexts/data.context';

const style: SxProps = {
  position: 'absolute' as const,
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
  const { onDeleteBookUnit } = useDataMethods();
  const [title, setTitle] = useState('Delete Book Unit');
  const [message, setMessage] =
    useState(`Deletion will only be successful if the unit is not assigned in
              any manuscript.`);
  const [deleting, { setTrue: setDeletingStarted, setFalse: setDeletingDone }] =
    useBoolean(false);
  const [success, { setTrue: setSuccessful, setFalse: setFailed }] =
    useBoolean(false);
  const handleDelete = useCallback(async () => {
    setDeletingStarted();
    try {
      onDeleteBookUnit!(value.Id!);
      setDeletingDone();
      setSuccessful();
      setTitle('Unit Deleted');
      setMessage(
        `Book unit(${bookUnitOrderDisplay(
          value?.Order ?? [],
          value?.FrameTags ?? [],
          value.Variant
        )})  ${value?.Title} was successfully deleted`
      );
    } catch {
      setDeletingDone();
      setFailed();
      setTitle('Delete failed');
      setMessage(
        `Book unit (${bookUnitOrderDisplay(
          value?.Order ?? [],
          value?.FrameTags ?? [],
          value.Variant
        )}) ${value?.Title} could not be deleted`
      );
    }
  }, [onDeleteBookUnit]);

  useEffect(() => {
    return () => {
      setFailed();
      setTitle('Delete Book Unit');
    };
  }, []);

  return (
    <Portal>
      <Modal open={isOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading
            color={success && !deleting ? 'primary.main' : 'warning.main'}
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
                  Attempt Deleting (
                  {bookUnitOrderDisplay(
                    value?.Order ?? [],
                    value?.FrameTags ?? [],
                    value.Variant
                  )}
                  ) {value?.Title}
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
