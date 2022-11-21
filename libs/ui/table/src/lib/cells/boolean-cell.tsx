import { CellContainer } from './cell-container';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import Avatar from '@mui/material/Avatar';

export const BooleanCell = ({ value, odd }: any) => (
  <CellContainer>
    {value !== undefined ? (
      <Avatar
        variant="rounded"
        sx={
          odd
            ? { bgcolor: '#CCCCCC', color: 'black', zIndex: 1 }
            : { bgcolor: 'white', color: 'black', zIndex: 1 }
        }
      >
        {value ? <CheckIcon /> : <CloseIcon />}
      </Avatar>
    ) : (
      ''
    )}
  </CellContainer>
);
