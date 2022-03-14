import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const CellContainer: React.FC = ({ children }) => (
  <Box
    sx={{
      width: '200px',
      height: '80px',
      overflow: 'hidden',
      pl: '.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </Box>
);
