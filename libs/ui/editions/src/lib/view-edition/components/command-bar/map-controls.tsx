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
import { MapPosition } from '@frontend/ui/editions';

export const MapControls = () => {
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
      border={mapState !== null ? 'white solid .5px' : 'none'}
      borderRadius="5px"
    >
      <Button
        onClick={() => toggleMap()}
        startIcon={
          <ViewComfyIcon
            sx={{ color: mapState !== null ? 'white' : '#CCCCCC' }}
          />
        }
      >
        <Typography
          color={mapState !== null ? 'white' : '#CCCCCC'}
          fontSize=".8rem"
        >
          Map
        </Typography>
      </Button>
      {mapState !== null && (
        <IconButton size="small" onClick={() => exportMap()}>
          <FileDownloadIcon fontSize="small" sx={{ color: 'white' }} />
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
            <Typography
              color={mapState === 'left' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              left [fit]
            </Typography>
          </ToggleButton>
          <ToggleButton value="left-XL" aria-label="small">
            <Typography
              color={mapState === 'left-XL' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              left
            </Typography>
          </ToggleButton>
          <ToggleButton value="bottom" aria-label="large">
            <Typography
              color={mapState === 'bottom' ? 'white' : '#CCCCCC'}
              fontSize=".8rem"
            >
              bottom
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Stack>
  );
};
