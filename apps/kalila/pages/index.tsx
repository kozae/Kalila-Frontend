import {
  KalilaLogo,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';

export function Index() {
  useNavbarMessage(['Home', undefined]);

  return (
    <Stack
      spacing={5}
      alignItems="center"
      sx={{ mt: '20px', padding: '1rem', minWidth: '200px' }}
    >
      <h1>Welcome!</h1>
      <KalilaLogo />
      <h2>Kalila Platform 2.0 Experimental Build</h2>
    </Stack>
  );
}

export default withTransition(Index, {});
