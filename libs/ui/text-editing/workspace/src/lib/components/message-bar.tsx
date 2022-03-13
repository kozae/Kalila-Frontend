import {
  kalilaTheme,
  selectRegionHoveredInFacsimileSpace,
  selectTextEditingAccessMode,
  selectTextEditingActiveWorkspace,
  selectTextEditingToolMode,
  useAppSelector,
} from '@frontend/shared-ui';
import Portal from '@mui/material/Portal';
import { AnimatePresence, motion } from 'framer-motion';
import Stack from '@mui/material/Stack';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Typography from '@mui/material/Typography';

const PulsingInfoIcon = () => (
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
);

const Message = ({ text, _key }: { text: string; _key: string }) => (
  <motion.div
    key={_key}
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
      justifyContent="center"
      sx={{
        height: '100%',
      }}
      spacing={2}
    >
      <PulsingInfoIcon />
      <Typography variant="h2" color="white">
        {text}
      </Typography>
    </Stack>
  </motion.div>
);

export const MessageBar = () => {
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const activeWorkspace = useAppSelector(selectTextEditingActiveWorkspace);
  const regionHoveredInFacsimileSpace = useAppSelector(
    selectRegionHoveredInFacsimileSpace
  );
  const showClickToEdit =
    regionHoveredInFacsimileSpace && accessMode === 'edit';
  const showDragElements =
    activeWorkspace === 'layout' && toolMode === 'reorder';
  const showDragLines = activeWorkspace === 'lines' && toolMode === 'reorder';
  const showLineAutomaticDetection =
    activeWorkspace === 'lines' && toolMode === 'automatic-detection';
  const showLineGenerationMessage =
    activeWorkspace === 'lines' && toolMode === 'generate';
  return (
    <Portal>
      <AnimatePresence>
        {showClickToEdit && <Message key="1" _key="1" text="Click to edit" />}
        {showDragElements && (
          <Message
            key="2"
            _key="2"
            text="Drag elements up and down to reorder them"
          />
        )}
        {showLineAutomaticDetection && (
          <Message key="3" _key="3" text="Automatic detection in progress..." />
        )}
        {showLineGenerationMessage && (
          <Message
            key="4"
            _key="4"
            text="Enter the number of lines to generate per text element."
          />
        )}
        {showDragLines && (
          <Message
            key="5"
            _key="5"
            text="Drag lines up and down to change their order in an element, or to reassign them to another one."
          />
        )}
      </AnimatePresence>
    </Portal>
  );
};
