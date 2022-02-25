import { IImageElement, ITextElement } from '@frontend/domain';
import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import { hexToRgba } from '@frontend/util';
import { LayoutAnalysisToolContext } from './layout-analysis-tool.context';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const Container: React.FC<{
  title: string;
  url: string;
  color?: string;
  icon: string;
  el: any;
}> = ({ children, title, url, color, icon, el }) => {
  const { onElementActivated, onElementSelected } = useContext(
    LayoutAnalysisToolContext
  );

  return (
    <Paper
      sx={{
        borderRadius: '5px 5px 0 0',
        position: 'relative',
        width: '40%',
        m: '10px',
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
            bgcolor: hexToRgba(color as string, 0.4),
            borderRadius: '5px 5px 0 0',
          }}
        >
          <Stack direction="row" alignItems="center">
            {icon === 'image' ? (
              <InsertPhotoTwoToneIcon color="secondary" />
            ) : (
              <TextSnippetTwoToneIcon color="secondary" />
            )}
            <Typography variant="h3">&nbsp;{title}</Typography>
          </Stack>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => onElementSelected(el._id)}
          >
            <EditIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Stack>
        <Box
          onMouseEnter={() => onElementActivated(el)}
          onMouseLeave={() => onElementActivated(null)}
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
      title={`${el.Order}. ${el.Position}`}
      url={url}
      color={el.HighlightColor}
      icon="text"
      el={el}
    />
  );
};
