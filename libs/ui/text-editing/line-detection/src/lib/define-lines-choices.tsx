import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { AutomaticLineDetection } from './automatic-line-detection';
import { useFirstLineGenerationHandler } from './hooks';
import {
  selectTextEditingToolMode,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { LineGeneration } from './line-generation';

export const DefineLinesChoices = () => {
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const dispatch = useAppDispatch();

  const manuallyDefineFirstLine = useFirstLineGenerationHandler();

  return toolMode === 'default' ? (
    <Stack spacing={3}>
      <Alert severity="info"> No lines defined yet </Alert>
      <Button
        onClick={() => dispatch(setTextEditingToolMode('automatic-detection'))}
      >
        Run automatic detection
      </Button>
      <Button onClick={() => dispatch(setTextEditingToolMode('generate'))}>
        Generate lines
      </Button>
      <Button onClick={manuallyDefineFirstLine}>Manually define lines</Button>
    </Stack>
  ) : toolMode === 'automatic-detection' ? (
    <AutomaticLineDetection />
  ) : toolMode === 'generate' ? (
    <LineGeneration />
  ) : (
    <></>
  );
};
