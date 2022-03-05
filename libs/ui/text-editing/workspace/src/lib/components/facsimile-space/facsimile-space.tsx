import { AnimatePresence, useAnimation, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FacsimileSpaceLoading } from './facsimile-space-loading';
import { FacsimileCanvas } from './facsimile-canvas';
import { FacsimileRegionPreview } from './facsimile-region-preview';
import {
  selectPageDataLoadingStatus,
  useAppSelector,
} from '@frontend/shared-ui';

const animationVariants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -200 },
};

export const FacsimileSpace = () => {
  const loading = useAppSelector(selectPageDataLoadingStatus);
  const [loaded, setLoaded] = useState(false);
  const animationControls = useAnimation();
  useEffect(() => {
    if (loaded) {
      animationControls.start('visible');
    }
  }, [loaded]);

  useEffect(() => {
    return () => {
      if (loading) {
        setLoaded(false);
        animationControls.set('hidden');
      }
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {loading ? (
          <FacsimileSpaceLoading />
        ) : (
          <motion.div
            key="facsimile-loaded"
            layout
            style={{
              width: '45%',
              height: 'fit-content',
            }}
            initial={'hidden'}
            animate={animationControls}
            variants={animationVariants}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 1, ease: 'easeIn' }}
          >
            <FacsimileCanvas onLoaded={() => setLoaded(true)} />
          </motion.div>
        )}
      </AnimatePresence>
      <FacsimileRegionPreview />
    </>
  );
};
