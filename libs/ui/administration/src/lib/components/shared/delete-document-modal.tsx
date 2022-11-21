import React from 'react';
import {
  IAdminPageContext,
  useAdminPageContext,
} from '../../admin-page.context';
import { KalilaDocument } from '@frontend/domain';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DialogHeading,
  kalilaTheme,
  UndrawExclamationMarkSVG,
} from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';

export interface IDeleteModalProps<T extends KalilaDocument> {
  doc: T;
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: ((doc: T) => void) | ((doc: T) => Promise<void>);
}

export const DeleteDocumentModal = <T extends KalilaDocument>({
  doc,
  isOpen,
  onDismiss,
  onConfirm,
}: IDeleteModalProps<T>) => {
  const { deleteModalMessage: message } =
    useAdminPageContext<T>() as IAdminPageContext<T>;

  return (
    <Dialog open={isOpen} onClose={onDismiss}>
      <DialogHeading color="warning" onDismiss={onDismiss}>
        <Typography color="white" variant="h5">
          Are you sure you want to delete this document?
        </Typography>
      </DialogHeading>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <UndrawExclamationMarkSVG
          width={'50px'}
          color={kalilaTheme.palette.warning.main}
        />
        <DialogContentText
          sx={{
            typography: 'h4',
            mt: '1rem',
            color: 'black',
            textAlign: 'center',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant={'outlined'}
          startIcon={<DeleteIcon />}
          color={'warning'}
          onClick={() => onConfirm(doc)}
        >
          Attempt deletion
        </Button>
      </DialogActions>
    </Dialog>
  );
};
