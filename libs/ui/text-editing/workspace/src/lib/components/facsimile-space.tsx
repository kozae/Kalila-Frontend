import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SimpleFullPage } from '@frontend/ui/facsimile';
import { selectImageUrl, useAppSelector } from '@frontend/shared-ui';
import { useImageContainerSize } from '../hooks/use-image-container-size';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export const FacsimileSpace = ({ loading }: any) => {
  const imageUrl = useAppSelector(selectImageUrl);
  const containerSize = useImageContainerSize();
  const noData = loading || imageUrl === '' || containerSize.height <= 0;
  return (
    <AnimatePresence exitBeforeEnter>
      {noData ? (
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
      ) : (
        <motion.div
          key="facsimile-loaded"
          layout
          style={{
            width: '45%',
            height: 'fit-content',
          }}
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -200 }}
          transition={{ duration: 2, ease: 'easeIn' }}
        >
          <SimpleFullPage
            url={imageUrl}
            width={containerSize.imageWidth}
            height={containerSize.imageHeight}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
