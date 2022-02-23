import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import {
  kalilaTheme,
  selectRegionDataUrl,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';

export const FacsimileRegionPreview = ({
  hoveredRegionId,
}: {
  hoveredRegionId: string | null;
}) => {
  const isXLScreen = useXLargeScreenMediaQuery();
  const regionPreview = useAppSelector(selectRegionDataUrl(hoveredRegionId));
  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {regionPreview ? (
          <motion.div
            key={regionPreview.substr(0, 100)}
            style={{
              position: 'fixed',
              top: 115,
              right: isXLScreen ? 'calc((100vw - 1600px)/2)' : 5,
              zIndex: 90,
              maxWidth: isXLScreen ? '800px' : '50%',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: kalilaTheme.shadows[16],
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <img width="100%" height="auto" src={regionPreview} alt="preview" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
};
