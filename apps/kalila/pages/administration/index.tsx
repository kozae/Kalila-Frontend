import { NextPage } from 'next';
import Alert from '@mui/material/Alert';
import { withAdminLayout } from '@frontend/ui/administration';
import {
  themeColors,
  UndrawChoiceSVG,
  useNavbarMessage,
} from '@frontend/shared-ui';

const Administration: NextPage = () => {
  useNavbarMessage(['Administration:', 'Select Activity']);
  return (
    <>
      <UndrawChoiceSVG width={'300px'} color={themeColors.mainGreen} />
      <Alert severity="info" sx={{ typography: 'h3' }}>
        Select one of the activities above to do administrative tasks
      </Alert>
    </>
  );
};

export default withAdminLayout(Administration, false);
