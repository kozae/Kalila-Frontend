import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { useBoolean } from '@frontend/util';

export interface INotificationBarProps {
  isMessageVisible: boolean;
  messageBarType: AlertColor;
  message: string;
  hideMessage: () => void;
}

export function useNotificationBar() {
  const [isMessageVisible, { setTrue: showMessage, setFalse: hideMessage }] =
    useBoolean(false);
  const [message, setMessage] = useState('');
  const [messageBarType, setMessageBarType] = useState('info');

  const notifyUser = (text: string, type: string) => {
    hideMessage();
    setMessage(text);
    setMessageBarType(type);
    showMessage();
    setTimeout(() => hideMessage(), 3000);
  };

  return { message, messageBarType, isMessageVisible, hideMessage, notifyUser };
}

export const NotificationBar = ({
  isMessageVisible,
  messageBarType,
  hideMessage,
  message,
}: INotificationBarProps) => {
  return (
    <Collapse in={isMessageVisible}>
      <Alert
        sx={{
          width: 'fit-content',
          minWidth: '300px',
          mb: 2,
          typography: 'body1',
        }}
        severity={messageBarType}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={hideMessage}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
};
