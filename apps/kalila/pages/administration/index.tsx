import { NextPage } from 'next';
import Alert from '@mui/material/Alert';
import { withAdminLayout } from '@frontend/ui/administration';
import {
  kalilaTheme,
  UndrawChoiceSVG,
  useLoginValidation,
} from '@frontend/shared-ui';
import { useMemo } from 'react';
import { useNavbarMessage } from '@frontend/kalila/components';

const Administration: NextPage = () => {
  useLoginValidation();
  const messages = useMemo(
    () => ['Administration:', 'Select Activity'] as [string, string],
    []
  );
  useNavbarMessage(messages);
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
