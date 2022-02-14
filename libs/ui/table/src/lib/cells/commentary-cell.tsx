import Typography from '@mui/material/Typography';
import React from 'react';
import { CellContainer } from './cell-container';
import { stringHasValue } from '@frontend/util';

export const CommentaryCell = ({ value }: any) => (
  <CellContainer>
    <Typography
      maxWidth="100%"
      maxHeight="100%"
      textOverflow="ellipsis"
      variant="body1"
    >
      {value !== undefined && stringHasValue(String(value)) ? 'commented' : ''}
    </Typography>
  </CellContainer>
);
