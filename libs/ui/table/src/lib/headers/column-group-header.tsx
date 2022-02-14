import Typography from '@mui/material/Typography';
import React from 'react';
import Box from '@mui/material/Box';

export const ColumnGroupHeader = ({ text, bgcolor, color, sx }: any) => {
  return (
    <Box
      sx={{
        width: '100%',
        p: '.2rem',
        height: '40px',
        bgcolor: bgcolor,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <Typography align="center" variant="h3">
        {text}
      </Typography>
    </Box>
  );
};
