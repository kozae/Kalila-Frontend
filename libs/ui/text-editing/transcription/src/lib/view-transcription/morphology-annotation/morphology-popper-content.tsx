import Box from '@mui/material/Box';
import { kalilaTheme } from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import { useCallback, useContext, useMemo, useState } from 'react';
import { ViewTranscriptionContext } from '../view-transcription';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Typography from '@mui/material/Typography';
import { IMorphology } from '@frontend/domain';
import { useKeyboardControls } from './hooks/keyboard-controls-hook';

interface IMorphologyPopperContentProps {
  onSelected: (d: IMorphology) => void;
  onSkip: () => void;
  onClose: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

export const MorphologyPopperContent = ({
  onSelected,
  onSkip,
  onClose,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}: IMorphologyPopperContentProps) => {
  const { morphologyData } = useContext(ViewTranscriptionContext);
  const pageSize = 4;
  const pages = Math.ceil(morphologyData.length / pageSize);
  const [currentPage, setCurrentPage] = useState(0);
  const slice = useMemo(
    () => [currentPage * pageSize, currentPage * pageSize + pageSize],
    [pages, currentPage]
  );
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev + 1 <= pages - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [pages]);

  const firstPage = () => {
    setCurrentPage(0);
  };
  const getMorphology = useCallback(
    (index: number) => {
      return morphologyData[index];
    },
    [morphologyData]
  );
  useKeyboardControls({
    moveUp: onMoveUp,
    moveDown: onMoveDown,
    moveLeft: onMoveLeft,
    moveRight: onMoveRight,
    gotoFirstPage: firstPage,
    gotoNextPage: nextPage,
    closePopper: onClose,
    skipToken: onSkip,
    selectChoice: useCallback(
      (n) => {
        const choice = getMorphology(currentPage * pageSize + n - 1);
        console.log('choice', choice);
        onSkip();
        // if (choice !== undefined) {
        //   onSelected(choice);
        // }
      },
      [currentPage, pageSize, getMorphology]
    ),
  });
  return (
    <Stack
      sx={{
        position: 'relative',
        border: 1,
        bgcolor: 'background.paper',
        maxWidth: '500px',
        width: 'fit-content',
        boxShadow: kalilaTheme.shadows[10],
        borderRadius: '10px',
      }}
    >
      <Stack
        direction="row"
        sx={{ width: '100%', mt: '5px' }}
        justifyContent="center"
      >
        <ButtonGroup
          size="small"
          variant="outlined"
          aria-label="outlined button group"
        >
          <Button onClick={onMoveUp}>
            <ArrowUpwardIcon />
          </Button>
          <Button onClick={onMoveDown}>
            <ArrowDownwardIcon />
          </Button>
          <Button onClick={onMoveLeft}>
            <ArrowBackIcon />
          </Button>
          <Button onClick={onMoveRight}>
            <ArrowForwardIcon />
          </Button>
        </ButtonGroup>
      </Stack>
      {morphologyData.length === 0 && (
        <Typography variant="body1" sx={{ p: '5px' }}>
          No Results
        </Typography>
      )}
      <Stack
        direction="row"
        flexWrap="wrap"
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          mt: '5px',
          mb: '5px',
        }}
        justifyContent="center"
      >
        {morphologyData.slice(slice[0], slice[1]).map(
          (d, i) =>
            d && (
              <Box key={d.Id} sx={{ m: '5px' }}>
                <Button
                  color="secondary"
                  sx={{ typography: 'body2', fontSize: '2.5rem' }}
                  variant="outlined"
                  onClick={() => onSelected(d)}
                >
                  <Stack alignItems="center" direction="row">
                    <Typography fontSize="2.5rem">{i + 1}.</Typography>
                    <Stack>
                      <Typography typography="body2" fontSize="2.5rem">
                        {d.Word}
                      </Typography>
                      <Typography typography="body2" fontSize="1rem">
                        ({d.Root}) ({d.Type})
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              </Box>
            )
        )}
      </Stack>
      <Stack
        sx={{ width: '100%', mb: '5px' }}
        alignItems="center"
        justifyContent="center"
        spacing={2}
        direction="row"
      >
        {pages > 1 && currentPage !== pages - 1 && (
          <Button
            size="small"
            disableElevation
            onClick={nextPage}
            variant="contained"
          >
            M. more choices...
          </Button>
        )}
        {pages > 1 && currentPage == pages - 1 && (
          <Button
            size="small"
            disableElevation
            onClick={firstPage}
            variant="contained"
          >
            F. to first page...
          </Button>
        )}
        <Button
          onClick={onSkip}
          disableElevation
          variant="contained"
          size="small"
        >
          S. skip
        </Button>
        <Button
          onClick={onClose}
          color="warning"
          variant="outlined"
          size="small"
        >
          X. close
        </Button>
      </Stack>
    </Stack>
  );
};
