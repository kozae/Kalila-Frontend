import Stack from '@mui/material/Stack';
import { useBehaviorOptions, useData } from './contexts';
import {
  Collation,
  CommandBar,
  FacsimilePreview,
  getMapContainerProps,
  ImageCollationModal,
  Map,
  SearchHints,
  TextHorizontalCollationModal,
  UnitTitlePreview,
} from './components';
import { useLargeScreenMediaQuery } from '@frontend/shared-ui';
import { CommandPanel } from './components/command-panel';
import { Alert, Snackbar } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

export const EditionPage = () => {
  const { mapState } = useBehaviorOptions();
  const { updateTime } = useData();
  const isXLScreen = useLargeScreenMediaQuery();

  const [open, setOpen] = useState(false);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, [updateTime]);

  return (
    <>
      {isXLScreen && <CommandBar />}
      {!isXLScreen && <CommandPanel />}
      <TextHorizontalCollationModal />
      <ImageCollationModal />
      <FacsimilePreview />
      <UnitTitlePreview />
      <SearchHints />
      <Stack
        direction={mapState === 'bottom' ? 'column-reverse' : 'row'}
        width="100%"
        justifyContent={
          mapState && mapState.startsWith('left') ? 'space-between' : 'center'
        }
        alignItems="center"
      >
        {mapState && (
          <Stack {...getMapContainerProps(mapState)}>
            <Map mapState={mapState} />
          </Stack>
        )}
        <Collation key={`${updateTime}`} />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          key={`sb_${updateTime}`}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            <Typography variant="h3">Edition updated!</Typography>
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};
