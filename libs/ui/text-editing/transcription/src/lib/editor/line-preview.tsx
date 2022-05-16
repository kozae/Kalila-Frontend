import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import {
  selectLineById,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import { useContext } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import useSWR from 'swr';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';
import { hexToRgbUint32Array } from '@frontend/util';

export const LinePreview = ({ id }: { id?: string }) => {
  const isXLScreen = useXLargeScreenMediaQuery();
  const line = useAppSelector((state) => selectLineById(state, id ?? ''));
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const { data: url } = useSWR(line?.Id, () => {
    if (line) {
      const [p, r] = mapDataForCropper(line.FacsimileRegion);
      const color = hexToRgbUint32Array(line.HighlightColor ?? '#6b9e1f');
      return facsimileCropper?.get_region(p, r, color);
    }

    return undefined;
  });
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
