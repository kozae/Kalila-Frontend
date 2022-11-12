import { CellContainer } from './cell-container';
import { stringHasValue } from '@frontend/util';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import { selectUserPictures, useAppSelector } from '@frontend/shared-ui';

export const EditorCell = ({ value, odd }: any) => {
  const picture = useAppSelector((state) => selectUserPictures(state, value));
  return (
    <CellContainer>
      {picture ? (
        <Avatar
          alt={stringHasValue(value) ? value.toUpperCase() : ''}
          src={picture}
        />
      ) : (
        <Avatar
          sx={
            odd
              ? { bgcolor: 'primary.light', color: 'white' }
              : { bgcolor: 'white', color: 'black' }
          }
        >
          {stringHasValue(value) ? value.toUpperCase() : ''}
        </Avatar>
      )}
    </CellContainer>
  );
};
