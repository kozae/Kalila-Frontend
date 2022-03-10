import Box from '@mui/material/Box';
import { IFacsimileRegion, ILine } from '@frontend/domain';
import { hexToRgba } from '@frontend/util';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface ILineSummaryProps {
  maxHeight?: string;
  line: Omit<ILine, 'Tokens'> & { ElementId: string };
  url: string;
}

export const LineSummary = ({ maxHeight, line, url }: ILineSummaryProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        bgcolor: hexToRgba(line.HighlightColor as string, 0.4),
        width: '100%',
      }}
    >
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
            maxHeight: maxHeight ?? '20vh',
            objectFit: 'contain',
            margin: '1vh 0.5vw 1vh 0.5vw',
          }}
          width="auto"
          height="auto"
          src={url}
          alt="region not defined"
        />
      </Box>
      <Box
        sx={{
          width: '20%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h1">{line.LineOrder + 1}</Typography>
      </Box>
    </Stack>
  );
};
