import { SxProps } from '@mui/material';
import { EditionStore } from '../store';
import { FC, useCallback } from 'react';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { BookUnitImagePreviewDynamic } from './image-preview';
import { EditionFontSize } from './models';
import { useLayoutOptions } from './contexts';

export const unitImageCycleModalStyle: (showNavbar: boolean) => SxProps = (
  showNavbar
) => ({
  position: 'absolute' as 'absolute',
  top: showNavbar ? '110px' : '50px',
  height: 'fit-content',
  maxHeight: '100vh',
  width: '100vw',
  boxShadow: 24,
  borderRadius: '10px',
});

export interface IEditionUnitImageCycleModalProps {
  unitIdx: number;
  unitTitle: string;
  sigla: string[];
  edition: EditionStore;
  onDismiss: () => void;
}

const SIZES: Record<EditionFontSize, string> = {
  xs: '200px',
  s: '300px',
  m: '350px',
  l: '400px',
  xl: '550px',
};

export const EditionUnitImageCycleModal: FC<
  IEditionUnitImageCycleModalProps
> = ({ edition, unitIdx, unitTitle, sigla, onDismiss }) => {
  const { size } = useLayoutOptions();
  const getColumn = useCallback(
    (siglum: string, i: number) => {
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
    <Stack width="100%" height="fit-content" maxHeight="100vh">
      <DialogHeading color="info.light" onDismiss={onDismiss}>
        <Typography fontSize="1.3rem" color="white">
          {unitTitle} Depicting Images
        </Typography>
      </DialogHeading>
      <Box width="100%" sx={{ overflowX: 'scroll' }}>
        <Stack direction="row" width="fit-content">
          {sigla.map(getColumn)}
        </Stack>
      </Box>
    </Stack>
  );
};
