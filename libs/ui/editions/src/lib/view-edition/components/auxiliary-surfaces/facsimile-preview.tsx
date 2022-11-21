import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import { LinePreviewContainer } from './line-preview';
import { useAuxiliarySurfacesData } from '../../contexts';
import {
  useSmallScreenMediaQuery,
  useWindowSize,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import {
  getHorizontalFloaterMotionProps,
  getHorizontalFloaterStyle,
  getVerticalFloaterMotionProps,
  getVerticalFloaterStyle,
} from './preview.helpers';
import { ImagePreviewContainer } from './image-preview';
import { PagePreview } from './page-preview';

export const FacsimilePreview = () => {
  const { activeLinePreview, activeImagePreview, activePagePreview } =
    useAuxiliarySurfacesData();
  const isXLScreen = useXLargeScreenMediaQuery();
  const isSmallScreen = useSmallScreenMediaQuery();
  const windowSize = useWindowSize();
  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {activeLinePreview && (
          <motion.div
            key={`${activeLinePreview.manuscriptSiglum}_${activeLinePreview.page}_${activeLinePreview.line}`}
            style={getVerticalFloaterStyle(
              activeLinePreview,
              isXLScreen,
              isSmallScreen
            )}
            {...getVerticalFloaterMotionProps(activeLinePreview)}
          >
            <LinePreviewContainer data={activeLinePreview} />
          </motion.div>
        )}
        {activeImagePreview && (
          <motion.div
            key={`${activeImagePreview.manuscriptSiglum}_${activeImagePreview.unitIdx}`}
            style={getHorizontalFloaterStyle(
              activeImagePreview,
              windowSize.width / 2
            )}
            {...getHorizontalFloaterMotionProps(
              activeImagePreview,
              windowSize.width / 2
            )}
          >
            <ImagePreviewContainer data={activeImagePreview} />
          </motion.div>
        )}
        {activePagePreview && (
          <motion.div
            key={`${activePagePreview.manuscriptSiglum}_${activePagePreview.page}`}
            style={getHorizontalFloaterStyle(
              activePagePreview,
              windowSize.width / 2
            )}
            {...getHorizontalFloaterMotionProps(
              activePagePreview,
              windowSize.width / 2
            )}
          >
            <PagePreview
              msSiglum={activePagePreview.manuscriptSiglum}
              pageNumber={activePagePreview.page}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};
