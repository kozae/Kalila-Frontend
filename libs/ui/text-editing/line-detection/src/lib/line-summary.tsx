import Box from '@mui/material/Box';
import { FacsimileRegion, ILine } from '@frontend/domain';
import { hexToRgba } from '@frontend/util';
import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  cancelCreateLine,
  deleteLine,
  onElementSelected,
  onRegionHoveredInToolSpace,
  selectCurrentPageManuscriptSiglum,
  selectCurrentPageNumber,
  selectLineHasTokens,
  selectTextEditingAccessMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRegionUrl } from '@frontend/ui/text-editing/shared';
import DownloadIcon from '@mui/icons-material/Download';

export interface ILineSummaryProps {
  maxHeight?: string;
  line: Omit<ILine, 'Tokens'> & { ElementId: string };
  buttons: boolean;
}

export const LineSummary = ({
  maxHeight,
  line,
  buttons,
}: ILineSummaryProps) => {
  const dispatch = useAppDispatch();
  const url = useRegionUrl(
    line?.Id,
    line.FacsimileRegion
      ? {
          Id: line.Id,
          Region: line.FacsimileRegion,
          // HighlightColor: el.HighlightColor,
          HighlightColor: '#6b9e1f',
        }
      : undefined
  );
  const handleHover = (
    region: { Region: FacsimileRegion; Id: string } | null
  ) => dispatch(onRegionHoveredInToolSpace(region));
  const handleSelection = (id: string | null, region: FacsimileRegion) =>
    dispatch(onElementSelected({ Id: id, Region: region }));
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  const siglum = useAppSelector(selectCurrentPageManuscriptSiglum);
  const pageNumber = useAppSelector(selectCurrentPageNumber);

  const lineHasTokens = useAppSelector((state) =>
    selectLineHasTokens(state, line.Id)
  );

  const handleDelete = (id: string) => {
    if (id.length !== 24) {
      dispatch(cancelCreateLine(id));
    } else {
      dispatch(deleteLine(id));
    }
  };

  const handleDownload = useCallback(() => {
    if (url && document) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${siglum}_p${pageNumber}_l${line.LineOrder}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [url, document, siglum, pageNumber]);

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
              Region: line.FacsimileRegion,
              Id: line.Id,
            } as { Region: FacsimileRegion; Id: string })
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
          <IconButton color="secondary" size="small" onClick={handleDownload}>
            <DownloadIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          {(accessMode.includes('edit') || accessMode.includes('admin')) && (
            <IconButton
              onClick={() => handleSelection(line.Id, line.FacsimileRegion)}
              color="secondary"
              size="medium"
            >
              <EditIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          )}
          {canDelete && (
            <IconButton
              onClick={() => handleDelete(line.Id)}
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
