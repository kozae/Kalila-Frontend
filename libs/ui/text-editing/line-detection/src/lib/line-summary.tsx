import Box from '@mui/material/Box';
import { IFacsimileRegion, ILine } from '@frontend/domain';
import { hexToRgba } from '@frontend/util';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  cancelCreateLine,
  deleteLine,
  onElementSelected,
  onRegionHoveredInToolSpace,
  selectLineHasTokens,
  selectTokensOfLine,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export interface ILineSummaryProps {
  maxHeight?: string;
  line: Omit<ILine, 'Tokens'> & { ElementId: string };
  url: string;
  buttons: boolean;
}

export const LineSummary = ({
  maxHeight,
  line,
  url,
  buttons,
}: ILineSummaryProps) => {
  const dispatch = useAppDispatch();
  const handleHover = (region: (IFacsimileRegion & { Id: string }) | null) =>
    dispatch(onRegionHoveredInToolSpace(region));
  const handleSelection = (id: string | null, region: IFacsimileRegion) =>
    dispatch(onElementSelected({ id, region }));

  const lineHasTokens = useAppSelector((state) =>
    selectLineHasTokens(state, line._id)
  );

  const handleDelete = (id: string) => {
    if (id.length !== 24) {
      dispatch(cancelCreateLine(id));
    } else {
      dispatch(deleteLine(id));
    }
  };

  const canDelete = !lineHasTokens;
  return (
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
          onMouseEnter={() =>
            handleHover({
              ...line.FacsimileRegion,
              Id: line._id,
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
      {buttons && (
        <Stack
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            ml: '10px',
          }}
          direction="row"
          alignItems="center"
        >
          <IconButton
            onClick={() => handleSelection(line._id, line.FacsimileRegion)}
            color="secondary"
            size="medium"
          >
            <EditIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          {canDelete && (
            <IconButton
              onClick={() => handleDelete(line._id)}
              color="error"
              size="medium"
            >
              <DeleteIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          )}
        </Stack>
      )}
    </Stack>
  );
};
