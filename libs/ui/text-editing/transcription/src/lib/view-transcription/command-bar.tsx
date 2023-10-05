import {
  kalilaTheme,
  selectTextEditingAccessMode,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import KeyboardAltTwoToneIcon from '@mui/icons-material/KeyboardAltTwoTone';
import {
  ViewTranscriptionContext,
  VisibleAnnotation,
} from './view-transcription';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';

export const CommandBar = () => {
  const { annotation, setAnnotation } = useContext(ViewTranscriptionContext);
  const handleAnnotationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAnnotation(
      (event.target as HTMLInputElement).value as VisibleAnnotation
    );
  };
  const accessMode = useAppSelector(selectTextEditingAccessMode);
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
      {(accessMode.includes('edit') || accessMode.includes('admin')) && (
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
        </Stack>
      )}
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
            value="lemma"
            control={<Radio />}
            label="Lemma"
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
