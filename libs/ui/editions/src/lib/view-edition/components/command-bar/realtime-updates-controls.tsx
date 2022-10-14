import Stack from '@mui/material/Stack';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { useBehaviorOptions, useBehaviorOptionsMethods } from '../../contexts';
import { ChangeEvent } from 'react';
import { useRouter } from 'next/router';

export const RealtimeUpdatesControls = () => {
  const { enableRealTimeUpdates } = useBehaviorOptions();
  const { setEnableRealTimeUpdates } = useBehaviorOptionsMethods();
  const router = useRouter();
  const handleRealTimeUpdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnableRealTimeUpdates(event.target.checked);
    if (event.target.checked) {
      router.reload();
    }
  };
  return (
    <Stack marginLeft="10px" direction="row" alignItems="center">
      <CloudSyncIcon
        sx={{ color: enableRealTimeUpdates ? 'white' : '#CCCCCC' }}
      />
      <Typography
        color={enableRealTimeUpdates ? 'white' : '#CCCCCC'}
        fontSize=".8rem"
      >
        &nbsp;Updates
      </Typography>
      <Switch
        color="secondary"
        checked={enableRealTimeUpdates}
        onChange={handleRealTimeUpdateChange}
      />
    </Stack>
  );
};
