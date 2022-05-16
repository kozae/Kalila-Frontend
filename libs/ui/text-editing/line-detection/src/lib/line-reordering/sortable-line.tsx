import { ILine } from '@frontend/domain';
import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { hexToRgba, hexToRgbUint32Array } from '@frontend/util';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import useSWR from 'swr';
import { mapDataForCropper } from '@frontend/ui/facsimile-cropper';

export type ISortableLineProps = (Omit<ILine, 'Tokens'> & {
  ElementId: string;
}) & {
  title?: string;
  height: string;
  width?: string;
};

export const SortableLine: React.FC<ISortableLineProps> = ({
  height,
  width,
  title,
  ...line
}) => {
  const { facsimileCropper } = useContext(TextEditingWorkspaceContext);
  const { data: url } = useSWR(line?.Id, () => {
    if (line.FacsimileRegion) {
      const [p, r] = mapDataForCropper(line.FacsimileRegion);
      const color = hexToRgbUint32Array(line.HighlightColor ?? '#6b9e1f');
      return facsimileCropper?.get_region(p, r, color);
    }
    return undefined;
  });
  return (
    <Box
      sx={{
        borderRadius: '5px 5px 0 0',
        position: 'relative',
        width: width ?? '40%',
        height: height,
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          bgcolor: hexToRgba(line.HighlightColor as string, 0.4),
          width: '100%',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: 0,
            pr: '10px',
          }}
        >
          <Typography variant="h1">{line.LineOrder + 1}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
          }}
        >
          <img
            style={{
              maxWidth: '100%',
              minWidth: '50%',
              maxHeight: height,
              objectFit: 'contain',
              margin: '1vh 0.5vw 1vh 0.5vw',
            }}
            width="auto"
            height="auto"
            src={url}
            alt="region not defined"
          />
        </Box>
      </Stack>
    </Box>
  );
};
