import { IFacsimileSpaceProps } from './facsimile-space-selector';
import { SimpleFullPage } from '@frontend/ui/facsimile';
import React, { useEffect, useState } from 'react';
import { useAnimation, motion } from 'framer-motion';

const animationVariants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -200 },
};

export const DescriptionFacsimileSpace = ({
  url,
  width,
  height,
  activeWorkspace,
}: IFacsimileSpaceProps) => {
  console.log(activeWorkspace);
  const [loaded, setLoaded] = useState(false);
  const animationControls = useAnimation();
  useEffect(() => {
    if (loaded) {
      animationControls.start('visible');
    }
  }, [loaded]);

  return (
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
      <SimpleFullPage
        url={url}
        width={width}
        height={height}
        onLoaded={() => setLoaded(true)}
      />
    </motion.div>
  );
};
