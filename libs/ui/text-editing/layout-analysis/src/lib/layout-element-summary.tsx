import { IImageElement, ITextElement } from '@frontend/domain';
import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import { hexToRgba } from '@frontend/util';
import { LayoutAnalysisToolContext } from './layout-analysis-tool.context';

const Container: React.FC<{
  title: string;
  url: string;
  color?: string;
  icon: string;
  el: any;
}> = ({ children, title, url, color, icon, el }) => {
  const { onElementHovered } = useContext(LayoutAnalysisToolContext);

  return (
    <Paper sx={{ width: '40%' }}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            width: '100%',
            p: '5px',
            bgcolor: hexToRgba(color as string, 0.4),
          }}
        >
          <Typography variant="h3">{title}</Typography>
          {icon === 'image' ? (
            <InsertPhotoTwoToneIcon />
          ) : (
            <TextSnippetTwoToneIcon />
          )}
        </Stack>
        <Box
          onMouseEnter={() => onElementHovered(el)}
          onMouseLeave={() => onElementHovered(null)}
        >
          <img width="100%" height="auto" src={url} alt="region not defined" />
        </Box>
      </Stack>
    </Paper>
  );
};

export const ImageElementSummary = ({
  url,
  ...el
}: IImageElement & { url: string }) => {
  return (
    <Container
      el={el}
      color={el.HighlightColor}
      title={el.Position}
      url={url}
      icon="image"
    />
  );
};

export const TextElementSummary = ({
  url,
  ...el
}: Omit<ITextElement, 'Lines'> & {
  url: string;
}) => {
  return (
    <Container
      title={`[${el.Order}] ${el.Position}`}
      url={url}
      color={el.HighlightColor}
      icon="text"
      el={el}
    />
  );
};
