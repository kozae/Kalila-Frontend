import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import { kalilaTheme } from '../constants';
import { IChildrenProp } from '../util';

export interface IDialogHeadingProps extends IChildrenProp {
  onDismiss: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export const DialogHeading: React.FC<IDialogHeadingProps> = ({
  children,
  onDismiss,
  color,
}) => {
  color = color ?? 'primary';
  return (
    <Stack
      sx={{
        width: '100%',
        minWidth: '400px',
        pl: '1rem',
        backgroundColor: kalilaTheme.palette[color].dark,
        borderRadius: '10px 10px 0 0',
      }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      {children}
      <Button
        size={'large'}
        onClick={onDismiss}
        sx={{ bgcolor: `${color}.dark` }}
        variant="contained"
        disableElevation
        aria-label="createDocument"
      >
        <ClearIcon />
      </Button>
    </Stack>
  );
};
