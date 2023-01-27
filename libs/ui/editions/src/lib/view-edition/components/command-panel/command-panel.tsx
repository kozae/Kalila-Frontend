import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { DownloadControls } from '../command-bar/download-controls';
import { useEffect, useState } from 'react';
import { useBehaviorOptionsMethods, useLayoutData } from '../../contexts';
import { FontControls } from '../command-bar/font-controls';
import { MapControls } from '../command-bar/map-controls';
import { PreviewControls } from '../command-bar/preview-controls';
import { RealtimeUpdatesControls } from '../command-bar/realtime-updates-controls';
import { SearchControls } from '../command-bar/search-controls';
import SearchIcon from '@mui/icons-material/Search';
import { kalilaTheme } from '@frontend/shared-ui';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

export const CommandPanel = () => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { setIsSearchActive } = useBehaviorOptionsMethods();
  const { username } = useLayoutData();

  const onSearchClicked = () => {
    setSearchOpen(true);
    setIsSearchActive(true);
  };
  useEffect(() => {
    import('react-device-detect').then((rdd) => {
      setIsMobile(rdd.isMobile);
    });
  }, []);
  return (
    <Portal>
      <Stack
        sx={{
          position: 'fixed',
          top: 0,
          right: '90px',
          height: '50px',
          width: 'fit-content',
          zIndex: 80,
        }}
        alignItems="center"
      >
        <Stack height="100%" direction="row" alignItems="center">
          <IconButton
            onClick={() => setSettingsOpen(true)}
            size="medium"
            color="secondary"
          >
            <SettingsTwoToneIcon />
          </IconButton>
          <IconButton
            onClick={() => onSearchClicked()}
            size="medium"
            color="secondary"
          >
            <SearchIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Slide direction="down" in={searchOpen}>
        <Stack
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '50px',
            width: '100vw',
            zIndex: 100,
            bgcolor: 'white',
          }}
          alignItems="center"
        >
          <SearchControls onClose={() => setSearchOpen(false)} />
        </Stack>
      </Slide>
      <Slide direction="down" in={settingsOpen}>
        <Stack
          position="relative"
          direction="row"
          flexWrap="wrap"
          minHeight="50px"
          justifyContent="space-around"
          p="5px"
          bgcolor="white"
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: 'fit-content',
            width: '100vw',
            zIndex: 100,
            boxShadow: kalilaTheme.shadows[4],
          }}
          spacing={0.5}
        >
          <DownloadControls />
          <FontControls sx={{ m: '5px' }} />
          {!isMobile && <MapControls sx={{ m: '5px' }} />}
          <PreviewControls />
          {username && !username.includes('guest') && (
            <RealtimeUpdatesControls />
          )}
          <Box flexGrow={1} />
          <IconButton
            onClick={() => setSettingsOpen(false)}
            size="large"
            color="secondary"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Slide>
    </Portal>
  );
};
