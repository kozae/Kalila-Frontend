import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { BaseEditor } from 'slate';
import { useContext } from 'react';
import { TranscriptionToolContext } from '../transcription-tool.context';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { kalilaTheme } from '@frontend/shared-ui';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

export interface ICommandBarProps {
  editor: BaseEditor & ReactEditor & HistoryEditor;
}

export const CommandBar = ({ editor }: ICommandBarProps) => {
  const { mode, setMode } = useContext(TranscriptionToolContext);

  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: '100%',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
        pb: '5px',
      }}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Stack
        flexWrap="wrap"
        sx={{ width: '100%' }}
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        spacing={1}
      >
        <ToggleButtonGroup color="secondary" value={1}>
          <Tooltip title="Sound, ctrl+1">
            <ToggleButton value={1} size="medium">
              &nbsp;&nbsp;
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Emended, ctrl+2">
            <ToggleButton value={2} size="small">
              &nbsp;*&nbsp;
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Corrupt, ctrl+3">
            <ToggleButton value={3} size="small">
              &nbsp;&dagger;&nbsp;
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Unintelligible, ctrl+4">
            <ToggleButton value={4} size="small">
              &nbsp;?&nbsp;
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Dittography, ctrl+5">
            <ToggleButton value={5} size="small">
              [&nbsp;]
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Added, ctrl+6">
            <ToggleButton value={6} size="small">
              {'< >'}
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Crossed-out, ctrl+7">
            <ToggleButton value={7} size="small">
              [[&nbsp;]]
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Suppletion, ctrl+8">
            <ToggleButton value={7} size="small">
              {'{ }'}
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
        <Button color="secondary" endIcon={<ArrowDropDownIcon />} size="small">
          insert
        </Button>
        <Button color="secondary" endIcon={<ArrowDropDownIcon />} size="small">
          morphology
        </Button>
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        justifyContent="center"
        alignItems="center"
        direction="row"
      >
        <Button
          startIcon={<ReadMoreIcon />}
          size="small"
          sx={{ position: 'absolute', right: 0 }}
        >
          {mode !== 'main' ? 'Edit Main Body' : 'Edit Legends and Marginalia'}
        </Button>
        <Typography variant="h2">
          {mode === 'main' ? 'Main Body' : 'Legends and Marginalia'}
        </Typography>
      </Stack>
    </Stack>
  );
};
