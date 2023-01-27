import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import {
  useBehaviorOptions,
  useBehaviorOptionsMethods,
  useLayoutData,
} from '../../contexts';
import { useCallback } from 'react';
import { SxProps } from '@mui/system';
import { MapPosition } from '../../models';

export const MapControls = ({ sx }: { sx?: SxProps }) => {
  const { mapState } = useBehaviorOptions();
  const { setMapState } = useBehaviorOptionsMethods();
  const { canvas } = useLayoutData();
  const handleMapPositionChange = (
    event: any,
    newState: MapPosition | 'hide' | null
  ) => {
    if (newState === 'hide') {
      setMapState(null);
    } else {
      setMapState(newState);
    }
  };
  const toggleMap = useCallback(() => {
    if (mapState) {
      setMapState(null);
    } else {
      setMapState('bottom');
    }
  }, [mapState]);

  const exportMap = useCallback(() => {
    if (canvas) {
      const svg = canvas.toSVG();
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('target', 'download');
      a.setAttribute('download', 'map.svg');
      a.click();
    }
  }, [canvas]);

  return (
    <Stack
      alignItems="center"
      direction="row"
      border={mapState !== null ? '#666666 solid .5px' : 'none'}
      borderRadius="5px"
      sx={sx}
    >
      <Button
        onClick={() => toggleMap()}
        startIcon={
          <ViewComfyIcon
            sx={{ color: mapState !== null ? 'secondary.main' : '#666666' }}
          />
        }
      >
        <Typography
          color={mapState !== null ? 'secondary.main' : '#666666'}
          fontSize=".8rem"
        >
          Map
        </Typography>
      </Button>
      {mapState !== null && (
        <IconButton size="small" onClick={() => exportMap()}>
          <FileDownloadIcon fontSize="small" sx={{ color: 'secondary.main' }} />
        </IconButton>
      )}
      {mapState !== null && (
        <ToggleButtonGroup
          value={mapState}
          color="secondary"
          exclusive
          onChange={handleMapPositionChange}
          aria-label="structure viz toggle"
        >
          <ToggleButton value="left" aria-label="small">
            <Typography fontSize=".8rem">left [fit]</Typography>
          </ToggleButton>
          <ToggleButton value="left-XL" aria-label="small">
            <Typography fontSize=".8rem">left</Typography>
          </ToggleButton>
          <ToggleButton value="bottom" aria-label="large">
            <Typography fontSize=".8rem">bottom</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Stack>
  );
};
