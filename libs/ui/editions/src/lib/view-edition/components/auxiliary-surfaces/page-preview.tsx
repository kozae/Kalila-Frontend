import { CSSProperties, FC } from 'react';
import useSWR from 'swr';
import { loadImageAsDataUrl } from '@frontend/ui/facsimile-cropper';
import { kalilaTheme } from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import { useData } from '../../contexts';
import { MotionProps } from 'framer-motion/types/motion/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export interface IPagePreviewProps {
  msSiglum: string;
  pageNumber: number;
}

export const PagePreview: FC<IPagePreviewProps> = ({
  msSiglum,
  pageNumber,
}) => {
  const { edition } = useData();
  const url = edition.get_url(`${msSiglum}_${pageNumber}`);
  const { data, isValidating } = useSWR(
    `${process.env['NEXT_PUBLIC_IMAGE_URL']}${url}`,
    loadImageAsDataUrl
  );

  return (
    <Stack
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      {isValidating && <CircularProgress />}
      {!isValidating && (
        <>
          <Box borderRadius="5px 5px 0 0" bgcolor="secondary.dark">
            <Typography variant="h2" color="white" p="10px">
              {msSiglum} p. {pageNumber}
            </Typography>
          </Box>
          <img
            style={{
              boxShadow: kalilaTheme.shadows[4],
              maxWidth: '100%',
              minWidth: '50%',
              maxHeight: '85%',
              objectFit: 'contain',
            }}
            width="auto"
            height="auto"
            src={data}
            alt="Loading..."
          />
        </>
      )}
    </Stack>
  );
};
