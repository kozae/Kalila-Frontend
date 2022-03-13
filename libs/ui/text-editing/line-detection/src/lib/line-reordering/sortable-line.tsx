import { ILine } from '@frontend/domain';
import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { hexToRgba } from '@frontend/util';

export type ISortableLineProps = (Omit<ILine, 'Tokens'> & {
  ElementId: string;
}) & {
  url: string;
  title?: string;
  height: string;
  width?: string;
};

export const SortableLine: React.FC<ISortableLineProps> = ({
  url,
  height,
  width,
  title,
  ...line
}) => {
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
