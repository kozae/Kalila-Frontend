import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  kalilaTheme,
  selectSelectedElement,
  selectTextEditingActiveWorkspace,
  useAppDispatch,
  useAppSelector,
  discardLayoutChanges,
  saveLayoutChanges,
} from '@frontend/shared-ui';
import { hexToRgba } from '@frontend/util';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useCallback } from 'react';

export const CommandBar = ({ hasChanges }: { hasChanges: boolean }) => {
  const selectedElement = useAppSelector(selectSelectedElement);
  const activeWorkspace = useAppSelector(selectTextEditingActiveWorkspace);
  const show = hasChanges && selectedElement.id === null;
  const dispatch = useAppDispatch();
  const handleDiscard = useCallback(() => {
    switch (activeWorkspace) {
      case 'description':
        break;
      case 'layout':
        dispatch(discardLayoutChanges({}));
        break;
      case 'lines':
        break;
      case 'transcription':
        break;
      case 'segmentation':
        break;
      default:
        break;
    }
  }, [activeWorkspace]);

  const handleSave = useCallback(() => {
    switch (activeWorkspace) {
      case 'description':
        break;
      case 'layout':
        dispatch(saveLayoutChanges({}));
        break;
      case 'lines':
        break;
      case 'transcription':
        break;
      case 'segmentation':
        break;
      default:
        break;
    }
  }, [activeWorkspace]);
  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <motion.div
            style={{
              position: 'fixed',
              left: 0,
              top: 60,
              width: '100vw',
              height: '50px',
              backgroundColor: hexToRgba(kalilaTheme.palette.primary.main, 0.5),
            }}
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.5, ease: 'easeIn' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack
                justifyContent="space-around"
                direction="row"
                sx={{ width: '30%', bgcolor: kalilaTheme.palette.primary.main }}
              >
                <Button
                  disableElevation
                  startIcon={<SaveTwoToneIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={handleSave}
                >
                  Save changes
                </Button>
                <Button
                  disableElevation
                  startIcon={<DeleteTwoToneIcon />}
                  variant="contained"
                  color="warning"
                  onClick={handleDiscard}
                >
                  Discard changes
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};
