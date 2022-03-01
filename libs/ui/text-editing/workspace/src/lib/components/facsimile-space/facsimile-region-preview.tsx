import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import {
  kalilaTheme,
  selectRegionDataUrl,
  selectRegionHoveredInFacsimileSpace,
  selectTextEditingAccessMode,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

export const FacsimileRegionPreview = () => {
  const isXLScreen = useXLargeScreenMediaQuery();
  const accessMode = useAppSelector(selectTextEditingAccessMode);

  const regionHoveredInFacsimileSpace = useAppSelector(
    selectRegionHoveredInFacsimileSpace
  );
  const regionPreview = useAppSelector(
    selectRegionDataUrl(
      regionHoveredInFacsimileSpace ? regionHoveredInFacsimileSpace.Id : null
    )
  );

  return (
    <>
      <Portal>
        <AnimatePresence>
          {regionHoveredInFacsimileSpace && accessMode === 'edit' ? (
            <motion.div
              style={{
                position: 'fixed',
                left: 0,
                top: 60,
                width: '100vw',
                height: '50px',
                backgroundColor: kalilaTheme.palette.info.main,
              }}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100vw' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  ml: isXLScreen ? 'calc(1rem + (100vw - 1600px)/2)' : 5,
                  height: '100%',
                }}
                spacing={2}
              >
                <motion.div
                  animate={{ scale: [0.9, 1.5, 0.9], opacity: [1, 0.7, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                  }}
                >
                  <InfoRoundedIcon sx={{ color: 'white', fontSize: '2rem' }} />
                </motion.div>
                <Typography variant="h2" color="white">
                  Click to edit
                </Typography>
              </Stack>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
      <Portal>
        <AnimatePresence exitBeforeEnter>
          {regionPreview ? (
            <motion.div
              key={regionPreview.substr(0, 100)}
              style={{
                position: 'fixed',
                top: 10,
                right: isXLScreen ? 'calc((100vw - 1600px)/2)' : 5,
                zIndex: 90,
                width: isXLScreen ? '800px' : '50%',
                height: 'calc(100vh - 10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <img
                style={{ boxShadow: kalilaTheme.shadows[16] }}
                width="100%"
                height="auto"
                src={regionPreview}
                alt="preview"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
};
