import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export const FullPageLoadingIndicator = () => (
  <Stack
    mt="5px"
    width="100%"
    height="calc(100vh - 110px - 10px)"
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <CircularProgress size={180} />
  </Stack>
);
