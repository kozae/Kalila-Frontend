import { SxProps } from '@mui/material';
import { FC, useCallback } from 'react';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BookUnitImagePreviewDynamic } from './image-preview';
import {
  useAuxiliarySurfacesData,
  useAuxiliarySurfacesMethods,
  useData,
  useLayoutData,
} from '../../contexts';
import { EditionFontSize } from '@frontend/ui/editions';
import Modal from '@mui/material/Modal';

export const unitImageCollationModalStyle: () => SxProps = () => ({
  position: 'absolute' as 'absolute',
  top: '10px',
  height: 'fit-content',
  maxHeight: '100vh',
  width: '100vw',
  boxShadow: 24,
  borderRadius: '10px',
});

const SIZES: Record<EditionFontSize, string> = {
  xs: '200px',
  s: '300px',
  m: '350px',
  l: '400px',
  xl: '550px',
};

export const ImageCollationModal: FC = () => {
  const { size } = useLayoutData();
  const { edition, rows } = useData();
  const sigla = edition.get_ms_sigla().split(',');
  const { visibleImageCollation } = useAuxiliarySurfacesData();
  const { setVisibleImageCollation } = useAuxiliarySurfacesMethods();
  const ondDismiss = () => setVisibleImageCollation(null);
  const getColumn = useCallback(
    (siglum: string, i: number, unitIdx: number) => {
      const pageNumber = edition.get_unit_image_page_number(i, unitIdx);
      const color = i % 2 === 0 ? '#FFFFFF' : '#F1F1F1';
      return (
        <Stack
          bgcolor={color}
          width={SIZES[size]}
          p="10px"
          key={siglum}
          alignItems="center"
        >
          <Typography variant="h3" p="1rem">
            {siglum} {pageNumber && `p.(${pageNumber})`}
          </Typography>
          {pageNumber ? (
            <BookUnitImagePreviewDynamic
              msSiglum={siglum}
              pageNumber={pageNumber}
              unitIndex={unitIdx}
              msIndex={i}
              edition={edition}
              color={color}
            />
          ) : (
            <Typography> [absent]</Typography>
          )}
        </Stack>
      );
    },
    [edition]
  );
  return (
    <Modal
      sx={{
        zIndex: 100,
      }}
      open={visibleImageCollation != null}
      onClose={ondDismiss}
    >
      <Box sx={unitImageCollationModalStyle()}>
        <Stack width="100%" height="fit-content" maxHeight="100vh">
          <DialogHeading color="info.light" onDismiss={ondDismiss}>
            <Typography fontSize="1.3rem" color="white">
              {visibleImageCollation !== null &&
                rows[visibleImageCollation].get_display()}{' '}
              Depicting Images
            </Typography>
          </DialogHeading>
          <Box width="100%" sx={{ overflowX: 'scroll' }}>
            <Stack direction="row" width="fit-content">
              {visibleImageCollation &&
                sigla.map((siglum, i) =>
                  getColumn(siglum, i, visibleImageCollation)
                )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};
