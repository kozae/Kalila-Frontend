import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {
  selectImageHeight,
  selectImageUrl,
  selectImageWidth,
  useAppSelector,
  useTextEditingWorkspaceStore,
  useWindowSize,
} from '@frontend/shared-ui';
import { SimpleFullPage } from '@frontend/ui/facsimile';
import CircularProgress from '@mui/material/CircularProgress';
import { useImageContainerSize } from './hooks/use-image-container-size';

export function TextEditingWorkspace({ pageData, imageInfo }: any) {
  useTextEditingWorkspaceStore(pageData, imageInfo);
  const imageUrl = useAppSelector(selectImageUrl);
  const containerSize = useImageContainerSize();
  return (
    <Stack mt="5px" width="100%" direction="row" spacing={1}>
      {containerSize.height <= 0 ? (
        <Box
          sx={{
            width: '45%',
            height: 'calc(100vh - 110px - 10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(153, 153, 153, 0.3)',
          }}
        >
          <CircularProgress size={160} />
        </Box>
      ) : (
        <Box
          sx={{
            width: containerSize.width,
            height: containerSize.height,
            display: 'block',
          }}
        >
          <SimpleFullPage
            url={imageUrl}
            width={containerSize.imageWidth}
            height={containerSize.imageHeight}
          />
        </Box>
      )}
      <Box>
        <h1>{pageData.Id}</h1>
      </Box>
    </Stack>
  );
}

export default TextEditingWorkspace;
