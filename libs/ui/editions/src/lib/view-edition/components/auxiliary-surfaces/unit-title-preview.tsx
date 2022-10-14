import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import { getUnitPreviewMotionProps, getUnitPreviewStyle } from '../map';
import Typography from '@mui/material/Typography';
import {
  useAuxiliarySurfacesData,
  useBehaviorOptions,
  useData,
} from '../../contexts';

export const UnitTitlePreview = () => {
  const { activeUnitPreview } = useAuxiliarySurfacesData();
  const { mapState } = useBehaviorOptions();
  const { rows } = useData();
  return (
    <Portal>
      <AnimatePresence exitBeforeEnter>
        {mapState && activeUnitPreview && (
          <motion.div
            key={`${activeUnitPreview[0]}_${activeUnitPreview[1]}_${activeUnitPreview[2]}`}
            style={{
              ...getUnitPreviewStyle(
                activeUnitPreview[1],
                activeUnitPreview[2],
                mapState
              ),
              position: 'fixed',
              zIndex: 90,
              backgroundColor: '#ffd899',
              padding: '10px',
              borderRadius: '5px',
            }}
            {...getUnitPreviewMotionProps()}
          >
            <Typography color="black" fontSize="1.3rem">
              {rows[activeUnitPreview[0]].get_display()}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};
