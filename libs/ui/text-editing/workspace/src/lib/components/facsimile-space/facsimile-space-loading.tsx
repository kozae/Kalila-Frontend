import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

export const FacsimileSpaceLoading = () => (
  <motion.div
    key="facsimile-loading"
    style={{
      width: '45%',
      height: 'fit-content',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5, ease: 'easeIn' }}
  >
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 110px - 10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(153, 153, 153, 0.3)',
      }}
    >
      <CircularProgress size={160} />
    </Box>
  </motion.div>
);
