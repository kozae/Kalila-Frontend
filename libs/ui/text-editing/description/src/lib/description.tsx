import {
  selectPageFacsimileUrl,
  selectTextEditingAccessMode,
  selectTextEditingToolMode,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import { EditDescription } from './edit-description';
import { ViewDescription } from './view-description';
import Button from '@mui/material/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { stringHasValue } from '@frontend/util';
import { EditFacsimile } from './edit-facsimile';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppTwoTone';

export const DescriptionTool = () => {
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const url = useAppSelector(selectPageFacsimileUrl);
  const dispatch = useAppDispatch();
  const changeMode = (mode: 'edit-description' | 'edit-facsimile') => {
    dispatch(setTextEditingToolMode(mode));
  };
  const motionProps = {
    style: {
      width: '100%',
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
    },
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'linear' },
  };
  return (
    <AnimatePresence exitBeforeEnter>
      {toolMode === 'edit-description' && (
        <motion.div {...motionProps} key="edit-description">
          <EditDescription />
        </motion.div>
      )}
      {toolMode === 'edit-facsimile' && (
        <motion.div {...motionProps} key="edit-facsimile">
          <EditFacsimile />
        </motion.div>
      )}
      {toolMode === 'default' && (
        <motion.div {...motionProps} key="default">
          <Stack width="100%" alignItems="center">
            <Stack direction="row">
              <Button
                startIcon={<GetAppTwoToneIcon />}
                variant="contained"
                disabled
                disableElevation
              >
                Export... (Soon!)
              </Button>
            </Stack>
            <ViewDescription />
            {(accessMode.includes('edit') || accessMode.includes('admin')) && (
              <Stack
                mt="10px"
                width="100%"
                justifyContent="space-around"
                direction="row"
              >
                <Button
                  disabled
                  variant="contained"
                  disableElevation
                  color="secondary"
                  onClick={() => changeMode('edit-description')}
                >
                  Edit Description (Soon!)
                </Button>
                <Button
                  disabled
                  variant="contained"
                  disableElevation
                  color="secondary"
                  onClick={() => changeMode('edit-facsimile')}
                >
                  {stringHasValue(url)
                    ? 'Replace Page Facsimile (Soon!)'
                    : 'Add Page Facsimile (Soon!)'}
                </Button>
              </Stack>
            )}
          </Stack>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
