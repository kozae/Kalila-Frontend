import Stack from '@mui/material/Stack';
import { FC } from 'react';
import Typography from '@mui/material/Typography';
import { useXLargeScreenMediaQuery } from '@frontend/shared-ui';

import { useBehaviorOptions, useData, useLayoutData } from '../../contexts';
import Portal from '@mui/material/Portal';
import { SearchControls } from './search-controls';
import { MapControls } from './map-controls';
import { FontControls } from './font-controls';
import { PreviewControls } from './preview-controls';
import { FullscreenControls } from './fullscreen-controls';
import { RealtimeUpdatesControls } from './realtime-updates-controls';

export const CommandBar: FC = () => {
  const { isSearchActive } = useBehaviorOptions();
  const { showNavbar, username } = useLayoutData();
  const { edition } = useData();
  const isXLScreen = useXLargeScreenMediaQuery();

  return (
    <Portal>
      <Stack
        sx={{
          position: 'fixed',
          top: showNavbar ? 60 : 0,
          height: '50px',
          width: '100%',
          zIndex: showNavbar ? 60 : 80,
          bgcolor: showNavbar ? 'none' : 'primary.main',
        }}
      >
        {!showNavbar && (
          <Typography
            sx={{
              position: 'absolute',
              left: isXLScreen ? 'calc((100% - 1600px) / 2)' : 0,
              bgcolor: 'none',
              width: 'fit-content',
              p: '0.5rem',
              color: 'white',
              fontSize: '1.2rem',
            }}
          >
            {edition.get_name()}
          </Typography>
        )}
        <Stack
          sx={{
            position: 'absolute',
            right: isXLScreen ? 'calc((100% - 1600px) / 2)' : 0,
            bgcolor: 'none',
            height: '50px',
            width: 'fit-content',
            pt: '2px',
            pb: '2px',
          }}
          spacing={3}
          direction="row"
        >
          <FontControls />
          <MapControls />
          {!isSearchActive && <PreviewControls />}
          {!isSearchActive && <FullscreenControls />}
          {!isSearchActive && username && !username.includes('guest') && (
            <RealtimeUpdatesControls />
          )}
          <SearchControls />
        </Stack>
      </Stack>
    </Portal>
  );
};
