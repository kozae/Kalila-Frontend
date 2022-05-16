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
  IChildrenProp,
  onElementSelected,
  onRegionHoveredInToolSpace,
  removeImageElement,
  removeTextElement,
  selectTextEditingAccessMode,
  selectTextElementHasLines,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { useRegionUrl } from './region-url-hook';

export type ILayoutElementSummaryProps = (
  | IImageElement
  | Omit<ITextElement, 'Lines'>
) & {
  icon: string;
  title?: string;
  buttons: boolean;
  maxHeight?: string;
  color?: string;
  width?: string;
} & IChildrenProp;

export const LayoutElementSummary: React.FC<ILayoutElementSummaryProps> = ({
  children,
  icon,
  buttons,
  maxHeight,
  width,
  color,
  title,
  ...el
}) => {
  const dispatch = useAppDispatch();
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  const url = useRegionUrl(
    el.Id,
    el.FacsimileRegion
      ? {
          ...el.FacsimileRegion,
          HighlightColor: el.HighlightColor,
        }
      : undefined
  );

  const handleHover = (region: (IFacsimileRegion & { Id: string }) | null) =>
    dispatch(onRegionHoveredInToolSpace(region));
  const handleSelection = (id: string | null, region: IFacsimileRegion) =>
    dispatch(onElementSelected({ id, region }));

  const elementHasLines = useAppSelector((state) =>
    selectTextElementHasLines(state, el.Id)
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
        mb: '10px !important',
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
            bgcolor: hexToRgba(color ?? (el.HighlightColor as string), 0.4),
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
              &nbsp;{`${el.Order + 1}. ${el.Position}`} &nbsp;
              {title}
            </Typography>
          </Stack>
          {buttons && (
            <Stack direction="row" alignItems="flex-end">
              {canDelete && (
                <IconButton
                  onClick={() => handleDelete(el.Id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              )}
              {accessMode !== 'view' && (
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() =>
                    handleSelection(
                      el.Id,
                      el.FacsimileRegion as IFacsimileRegion
                    )
                  }
                >
                  <EditIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>
        <Box
          sx={{
            bgcolor: hexToRgba(color ?? (el.HighlightColor as string), 0.4),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            onMouseEnter={() =>
              handleHover({
                ...el.FacsimileRegion,
                Id: el.Id,
              } as IFacsimileRegion & { Id: string })
            }
            onMouseLeave={() => handleHover(null)}
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
        {children}
      </Stack>
    </Paper>
  );
};
