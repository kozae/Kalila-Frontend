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

export type ILayoutElementSummaryProps = (
  | IImageElement
  | Omit<ITextElement, 'Lines'>
) & {
  url: string;
  icon: string;
  buttons: boolean;
  maxHeight?: string;
  width?: string;
};

export const LayoutElementSummary: React.FC<ILayoutElementSummaryProps> = ({
  url,
  icon,
  buttons,
  maxHeight,
  width,
  ...el
}) => {
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
        width: width ?? '40%',
        mt: '10px !important',
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
            bgcolor: hexToRgba(el.HighlightColor as string, 0.4),
            borderRadius: '5px 5px 0 0',
          }}
        >
          <Stack direction="row" alignItems="center">
            {icon === 'image' ? (
              <InsertPhotoTwoToneIcon color="secondary" />
            ) : (
              <TextSnippetTwoToneIcon color="secondary" />
            )}
            <Typography variant="h3">
              &nbsp;{`${el.Order}. ${el.Position}`}
            </Typography>
          </Stack>
          {buttons && (
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
                  handleSelection(
                    el._id,
                    el.FacsimileRegion as IFacsimileRegion
                  )
                }
              >
                <EditIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Stack>
          )}
        </Stack>
        <Box
          onMouseEnter={() =>
            handleHover({
              ...el.FacsimileRegion,
              Id: el._id,
            } as IFacsimileRegion & { Id: string })
          }
          onMouseLeave={() => handleHover(null)}
          sx={{
            bgcolor: hexToRgba(el.HighlightColor as string, 0.4),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
      </Stack>
    </Paper>
  );
};
