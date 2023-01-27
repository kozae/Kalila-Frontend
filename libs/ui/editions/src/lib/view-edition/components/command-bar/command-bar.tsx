import Stack from '@mui/material/Stack';
import { FC } from 'react';
import { useBehaviorOptions, useLayoutData } from '../../contexts';
import Portal from '@mui/material/Portal';
import { SearchControls } from './search-controls';
import { MapControls } from './map-controls';
import { FontControls } from './font-controls';
import { PreviewControls } from './preview-controls';
import { RealtimeUpdatesControls } from './realtime-updates-controls';
import { DownloadControls } from './download-controls';

export const CommandBar: FC = () => {
  const { isSearchActive } = useBehaviorOptions();
  const { username } = useLayoutData();

  return (
    <Portal>
      <Stack
        sx={{
          position: 'fixed',
          top: 0,
          right: 'calc(200px + (100vw - 1600px) / 2)',
          height: '50px',
          width: 'fit-content',
          zIndex: 80,
        }}
      >
        <Stack
          sx={{
            bgcolor: 'none',
            height: '50px',
            width: 'fit-content',
            pt: '2px',
            pb: '2px',
          }}
          spacing={3}
          direction="row"
        >
          <DownloadControls />
          <FontControls />
          <MapControls />
          {!isSearchActive && <PreviewControls />}
          {!isSearchActive && username && !username.includes('guest') && (
            <RealtimeUpdatesControls />
          )}
          <SearchControls />
        </Stack>
      </Stack>
    </Portal>
  );
};
