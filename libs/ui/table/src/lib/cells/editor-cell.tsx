import { CellContainer } from './cell-container';
import { stringHasValue } from '@frontend/util';
import React from 'react';
import Avatar from '@mui/material/Avatar';

export const EditorCell = ({ value, odd }: any) => (
  <CellContainer>
    <Avatar
      sx={
        odd
          ? { bgcolor: 'primary.light', color: 'white' }
          : { bgcolor: 'white', color: 'black' }
      }
    >
      {stringHasValue(value) ? value.toUpperCase() : ''}
    </Avatar>
  </CellContainer>
);
