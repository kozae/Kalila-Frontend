import { selectImageUrl, useAppSelector } from '@frontend/shared-ui';
import { AnimatePresence, useAnimation, motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { TextEditingWorkspaceContext } from '../../text-editing-workspace-context';
import { useImageContainerSize } from '../../hooks/use-image-container-size';
import { FacsimileSpaceLoading } from './facsimile-space-loading';
import { FacsimileCanvas, IFacsimileCanvasProps } from './facsimile-canvas';

const animationVariants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -200 },
};

export const FacsimileSpace = () => {
  const { loading, activeWorkspace } = useContext(TextEditingWorkspaceContext);
  const imageUrl = useAppSelector(selectImageUrl);
  const containerSize = useImageContainerSize();

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

  const props: IFacsimileCanvasProps = {
    url: imageUrl,
    width: containerSize.width,
    height: containerSize.height,
    scaleRatio: containerSize.scaleRatio,
    activeWorkspace,
    onLoaded: () => setLoaded(true),
  };
  const noData = loading || imageUrl === '' || containerSize.height <= 0;
  return (
    <AnimatePresence exitBeforeEnter>
      {noData ? (
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
          <FacsimileCanvas {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
