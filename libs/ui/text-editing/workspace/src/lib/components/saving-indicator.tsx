import { selectIsSaving, useAppSelector } from '@frontend/shared-ui';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const SavingIndicator = () => {
  const isSaving = useAppSelector(selectIsSaving);
  return (
    <Portal>
      {isSaving && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={200} color="primary" />
        </Box>
      )}
    </Portal>
  );
};
