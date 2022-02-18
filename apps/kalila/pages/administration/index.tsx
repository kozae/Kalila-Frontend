import { NextPage } from 'next';
import Alert from '@mui/material/Alert';
import { withAdminLayout } from '@frontend/ui/administration';
import {
  kalilaTheme,
  UndrawChoiceSVG,
  useNavbarMessage,
} from '@frontend/shared-ui';

const Administration: NextPage = () => {
  useNavbarMessage(['Administration:', 'Select Activity']);
  return (
    <>
      <UndrawChoiceSVG
        width={'300px'}
        color={kalilaTheme.palette.primary.main}
      />
      <Alert severity="info" sx={{ typography: 'h3' }}>
        Select one of the activities above to do administrative tasks
      </Alert>
    </>
  );
};

export default withAdminLayout(Administration, false);
