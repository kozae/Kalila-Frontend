import {
  IFacsimileRegion,
  IImageElement,
  ITextElement,
} from '@frontend/domain';
import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import { hexToRgba } from '@frontend/util';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  cancelCreateImageElement,
  cancelCreateTextElement,
  onElementSelected,
  onRegionHoveredInToolSpace,
  removeImageElement,
  removeTextElement,
  selectTextElementHasLines,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';

const Container: React.FC<{
  title: string;
  url: string;
  color?: string;
  icon: string;
  el: any;
}> = ({ children, title, url, color, icon, el }) => {
  const dispatch = useAppDispatch();
  const handleHover = (region: (IFacsimileRegion & { Id: string }) | null) =>
    dispatch(onRegionHoveredInToolSpace(region));
  const handleSelection = (id: string | null, region: IFacsimileRegion) =>
    dispatch(onElementSelected({ id, region }));

  const elementHasLines = useAppSelector((state) =>
    selectTextElementHasLines(state, el._id)
  );

  const canDelete = !elementHasLines;

  const handleDelete = (id: string) => {
    if (id.length !== 24) {
      if (icon === 'image') {
        dispatch(cancelCreateImageElement(id));
      } else {
        dispatch(cancelCreateTextElement(id));
      }
    } else {
      if (icon === 'image') {
        dispatch(removeImageElement(id));
      } else {
        dispatch(removeTextElement(id));
      }
    }
  };

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
          <Stack direction="row" alignItems="flex-end">
            {canDelete && (
              <IconButton
                onClick={() => handleDelete(el._id)}
                color="error"
                size="small"
              >
                <DeleteIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            )}
            <IconButton
              color="secondary"
              size="small"
              onClick={() =>
                handleSelection(el._id, el.FacsimileRegion as IFacsimileRegion)
              }
            >
              <EditIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Stack>
        </Stack>
        <Box
          onMouseEnter={() =>
            handleHover({ ...el.FacsimileRegion, Id: el._id })
          }
          onMouseLeave={() => handleHover(null)}
          sx={{ bgcolor: hexToRgba(color as string, 0.4) }}
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
