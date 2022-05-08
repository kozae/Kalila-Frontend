import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import {
  selectRegionHoveredInFacsimileSpace,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import useSWR from 'swr';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';

export const FacsimileRegionPreview = () => {
  const isXLScreen = useXLargeScreenMediaQuery();
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const regionHoveredInFacsimileSpace = useAppSelector(
    selectRegionHoveredInFacsimileSpace
  );

  const { data: regionPreview } = useSWR(
    regionHoveredInFacsimileSpace?.Id,
    () => {
      if (regionHoveredInFacsimileSpace) {
        const [p, r] = mapDataForCropper(regionHoveredInFacsimileSpace);
        return facsimileCropper?.get_region(p, r);
      }

      return undefined;
    }
  );

  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {regionHoveredInFacsimileSpace && regionPreview ? (
          <motion.div
            key={regionHoveredInFacsimileSpace.Id}
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
              src={regionPreview}
              alt="preview"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
};
