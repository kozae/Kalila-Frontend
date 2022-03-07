import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import {
  selectRegionDataUrlById,
  selectRegionHoveredInFacsimileSpace,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';

export const FacsimileRegionPreview = () => {
  const isXLScreen = useXLargeScreenMediaQuery();
  const regionHoveredInFacsimileSpace = useAppSelector(
    selectRegionHoveredInFacsimileSpace
  );
  const regionPreview = useAppSelector((state) =>
    selectRegionDataUrlById(
      state,
      regionHoveredInFacsimileSpace ? regionHoveredInFacsimileSpace.Id : ''
    )
  );

  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {regionPreview && regionPreview.data ? (
          <motion.div
            key={regionPreview.id}
            style={{
              position: 'fixed',
              top: 110,
              right: isXLScreen ? 'calc((100vw - 1600px)/2)' : 5,
              zIndex: 90,
              width: isXLScreen ? '800px' : '50%',
              height: 'calc(100vh - 110px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <img
              style={{
                maxWidth: '100%',
                minWidth: '50%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              width="auto"
              height="auto"
              src={regionPreview.data}
              alt="preview"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
};
