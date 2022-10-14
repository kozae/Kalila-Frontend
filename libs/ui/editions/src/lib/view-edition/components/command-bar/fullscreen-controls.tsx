import Button from '@mui/material/Button';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Typography from '@mui/material/Typography';
import { useLayoutData, useLayoutDataMethods } from '../../contexts';
import { useCallback } from 'react';

export const FullscreenControls = () => {
  const { showNavbar } = useLayoutData();
  const { setShowNavbar } = useLayoutDataMethods();
  const toggleFullScreen = useCallback(() => {
    setShowNavbar(!showNavbar);
  }, [showNavbar]);

  return (
    <Button
      onClick={() => toggleFullScreen()}
      startIcon={
        <FullscreenIcon sx={{ color: !showNavbar ? 'white' : '#CCCCCC' }} />
      }
    >
      <Typography color={!showNavbar ? 'white' : '#CCCCCC'} fontSize=".8rem">
        Fullscreen
      </Typography>
    </Button>
  );
};
