import { IImageElement, ITextElement } from '@frontend/domain';
import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';

import { kalilaTheme } from '@frontend/shared-ui';

export type ITextElementMarkProps = (
  | IImageElement
  | Omit<ITextElement, 'Lines'>
) & {
  url: string;
  title?: string;
  height: string;
  width?: string;
  main?: boolean;
};

export const TextElementMark: React.FC<ITextElementMarkProps> = ({
  url,
  height,
  width,
  title,
  main,
  ...el
}) => {
  return (
    <Paper
      sx={{
        borderRadius: '5px 5px 0 0',
        position: 'relative',
        width: width ?? '40%',
        height: height,
      }}
    >
      <Stack sx={{ borderRadius: '5px 5px 0 0' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: '100%',
            p: '5px',
            bgcolor: main
              ? kalilaTheme.palette.secondary.dark
              : kalilaTheme.palette.primary.dark,
            borderRadius: '5px 5px 0 0',
          }}
        >
          <Stack direction="row" alignItems="center">
            <TextSnippetTwoToneIcon sx={{ color: 'white' }} />
            <Typography color="white" variant="h3">
              &nbsp;{`${el.Order}. ${el.Position}`} &nbsp;
              {title}
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            bgcolor: main
              ? kalilaTheme.palette.secondary.dark
              : kalilaTheme.palette.primary.dark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <img
            style={{
              maxWidth: '100%',
              minWidth: '50%',
              maxHeight: `calc(${height} - 40px)`,
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
    </Paper>
  );
};
