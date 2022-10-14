import { FC } from 'react';
import { SxProps } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DialogHeading } from '@frontend/shared-ui';
import { EditionFontSize } from '@frontend/ui/editions';
import { Cell } from '../collation/cell';
import {
  useAuxiliarySurfacesData,
  useAuxiliarySurfacesMethods,
  useData,
  useLayoutData,
} from '../../contexts';
import Portal from '@mui/material/Portal';
import Modal from '@mui/material/Modal';

const horizontalCollationModalStyle: (showNavbar: boolean) => SxProps = (
  showNavbar
) => ({
  position: 'absolute' as 'absolute',
  top: showNavbar ? '110px' : '50px',
  right: '100px',
  height: 'fit-content',
  maxHeight: '100vh',
  width: 'calc(100vw - 200px)',
  boxShadow: 24,
  borderRadius: '10px',
});

const HEIGHT: Record<EditionFontSize, string> = {
  xs: '40px',
  s: '50px',
  m: '55px',
  l: '65px',
  xl: '80px',
};

export const TextHorizontalCollationModal: FC = () => {
  const { size, showNavbar } = useLayoutData();
  const { visibleHorizontalTextCollation } = useAuxiliarySurfacesData();
  const { setVisibleHorizontalTextCollation } = useAuxiliarySurfacesMethods();
  const { edition, rows } = useData();
  const sigla = edition.get_ms_sigla().split(',');
  const onDismiss = () => setVisibleHorizontalTextCollation(null);
  const height = HEIGHT[size];
  return (
    <Portal>
      <Modal
        sx={{
          zIndex: 10,
        }}
        open={visibleHorizontalTextCollation != null}
        onClose={onDismiss}
      >
        <Box sx={horizontalCollationModalStyle(showNavbar)}>
          <Stack width="100%" height="fit-content" maxHeight="100vh">
            <DialogHeading color="info.light" onDismiss={onDismiss}>
              <Typography fontSize="1.3rem" color="white">
                {visibleHorizontalTextCollation !== null &&
                  rows[visibleHorizontalTextCollation].get_display()}
              </Typography>
            </DialogHeading>
            <Stack direction="row-reverse" width="100%">
              <Stack borderLeft="dotted black 2px" width="10%">
                {sigla.map((siglum, index) => (
                  <Typography
                    key={siglum}
                    bgcolor={index % 2 === 0 ? 'white' : '#F1F1F1'}
                    variant="h3"
                    p="1rem"
                    height={height}
                    textAlign="center"
                    sx={{
                      verticalAlign: 'center',
                    }}
                  >
                    {siglum}
                  </Typography>
                ))}
              </Stack>
              <Box width="90%" sx={{ overflowX: 'scroll', direction: 'rtl' }}>
                <Stack minWidth="100%" width="fit-content">
                  {visibleHorizontalTextCollation !== null &&
                    sigla.map((siglum, index) => (
                      <Cell
                        key={siglum}
                        style={{
                          height,
                          bgcolor: index % 2 === 0 ? 'white' : '#F1F1F1',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        msIndex={index}
                        unitIndex={visibleHorizontalTextCollation}
                        flexWrap="nowrap"
                        direction="row"
                      />
                    ))}
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Portal>
  );
};
