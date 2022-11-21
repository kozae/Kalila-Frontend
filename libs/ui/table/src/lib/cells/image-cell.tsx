import Typography from '@mui/material/Typography';
import React from 'react';
import { CellContainer } from './cell-container';
import { stringHasValue } from '@frontend/util';
import Box from '@mui/material/Box';

export const ImageCell = ({ value }: any) => (
  <Box
    sx={{
      width: '200px',
      height: '150px',
      overflow: 'hidden',
      pl: '.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {value ? (
      <img
        height="100%"
        width="auto"
        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}${value}`}
        alt="loading.."
      />
    ) : (
      <Typography
        maxWidth="100%"
        maxHeight="100%"
        textOverflow="ellipsis"
        variant="body1"
        align="center"
        textAlign="center"
      >
        no facsimile
      </Typography>
    )}
  </Box>
);
