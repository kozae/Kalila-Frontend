import {
  kalilaTheme,
  setTextEditingToolMode,
  useAppDispatch,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import KeyboardAltTwoToneIcon from '@mui/icons-material/KeyboardAltTwoTone';
import DataObjectIcon from '@mui/icons-material/DataObject';
import {
  ViewTranscriptionContext,
  VisibleAnnotation,
} from './view-transcription';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { useCallback, useContext } from 'react';

export interface ICommandBarProps {}

export const CommandBar = ({}: ICommandBarProps) => {
  const {
    annotation,
    setAnnotation,
    setSelectedToken,
    selectedToken,
    setMorphologyPopperAnchor,
  } = useContext(ViewTranscriptionContext);
  const handleAnnotationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAnnotation(
      (event.target as HTMLInputElement).value as VisibleAnnotation
    );
  };
  const handleMorphologyAnnotationClicked = useCallback(() => {
    if (setSelectedToken) {
      if (selectedToken.line === undefined) {
        setSelectedToken({ line: 0, token: 0, elementType: 'main' });
      } else {
        setMorphologyPopperAnchor(null);
        setSelectedToken({
          line: undefined,
          token: undefined,
          elementType: 'main',
        });
      }
    }
  }, [selectedToken]);
  const dispatch = useAppDispatch();
  const showEditor = () => {
    dispatch(setTextEditingToolMode('main-body'));
  };
  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: '100%',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
      }}
      justifyContent="space-around"
      alignItems="center"
    >
      <Stack
        sx={{ width: '100%' }}
        direction={'row'}
        justifyContent="space-around"
        alignItems="center"
      >
        <Button
          startIcon={<KeyboardAltTwoToneIcon />}
          color="secondary"
          size={'small'}
          onClick={showEditor}
        >
          Edit Transcription
        </Button>
        <Button
          onClick={handleMorphologyAnnotationClicked}
          startIcon={<DataObjectIcon />}
          color="secondary"
          size={'small'}
        >
          {selectedToken.line === undefined
            ? 'Edit Morphological Annotations'
            : 'Morphological Annotations Done'}
        </Button>
      </Stack>
      <FormControl>
        <RadioGroup
          row
          sx={{ display: 'flex', alignItems: 'center' }}
          value={annotation}
          onChange={handleAnnotationChange}
        >
          <Typography>Annotation:&nbsp;&nbsp;&nbsp;</Typography>
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="none"
            control={<Radio />}
            label="None"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="vocalized"
            control={<Radio />}
            label="Vocalized"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="rasm"
            control={<Radio />}
            label="Rasm"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="root"
            control={<Radio />}
            label="Root"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="stem"
            control={<Radio />}
            label="Stem"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="wazn"
            control={<Radio />}
            label="Wazn"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="pos"
            control={<Radio />}
            label="PoS"
          />
          <FormControlLabel
            sx={{ typography: 'body1' }}
            value="type"
            control={<Radio />}
            label="Type"
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};
