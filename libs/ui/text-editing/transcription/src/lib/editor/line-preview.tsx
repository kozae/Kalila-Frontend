import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import {
  selectRegionDataUrlById,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';

export const LinePreview = ({ id }: { id?: string }) => {
  const isXLScreen = useXLargeScreenMediaQuery();
  const regionPreview = useAppSelector((state) =>
    selectRegionDataUrlById(state, id ?? '')
  );
  const url = regionPreview?.data;
  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {id && url ? (
          <motion.div
            key={id}
            style={{
              position: 'fixed',
              top: 60,
              right: isXLScreen ? 'calc((100vw - 1600px)/2)' : 5,
              zIndex: 90,
              width: isXLScreen ? '800px' : '50%',
              height: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
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
              src={url}
              alt="preview"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
};
