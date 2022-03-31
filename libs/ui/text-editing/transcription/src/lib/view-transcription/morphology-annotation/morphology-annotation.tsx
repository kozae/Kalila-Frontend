import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import { useContext, useEffect } from 'react';
import {
  ISelectedToken,
  IViewTranscriptionProps,
  ViewTranscriptionContext,
} from '../view-transcription';
import Mousetrap from 'mousetrap';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { flatten } from 'lodash';
import { ITextElement } from '@frontend/domain';
import {
  selectTokenCountsOfLinesAsMapOfOrder,
  useAppSelector,
} from '@frontend/shared-ui';

type ITokenCounts = Record<'main' | 'other', Record<number, number>>;

export const MorphologyAnnotation = ({
  mainBodyElements,
  otherElements,
  linesToElementMap,
}: IViewTranscriptionProps) => {
  const { morphologyPopperAnchor, setSelectedToken, morphologyData } =
    useContext(ViewTranscriptionContext);
  const morphologyPopperOpen = Boolean(morphologyPopperAnchor);

  const createLinesSummary = (elements: Omit<ITextElement, 'Lines'>[]) =>
    flatten(
      elements.map(({ Id }) =>
        linesToElementMap[Id].map(
          ({ Id, LineOrder }) => [Id, LineOrder] as [string, number]
        )
      )
    );

  const tokenCounts: ITokenCounts = {
    main: useAppSelector((state) =>
      selectTokenCountsOfLinesAsMapOfOrder(
        state,
        createLinesSummary(mainBodyElements)
      )
    ),
    other: useAppSelector((state) =>
      selectTokenCountsOfLinesAsMapOfOrder(
        state,
        createLinesSummary(otherElements)
      )
    ),
  };
  console.log({ tokenCounts });
  useEffect(() => {
    if (setSelectedToken) {
      Mousetrap.bind('up', (e) => {
        e.preventDefault();
        console.log('calling custom event');
        setSelectedToken(({ line, token, elementType }: ISelectedToken) => {
          return {
            line: line !== undefined && line > 0 ? line - 1 : undefined,
            token,
            elementType,
          };
        });
      });
      Mousetrap.bind('down', (e) => {
        e.preventDefault();
        setSelectedToken(({ line, token, elementType }: ISelectedToken) => {
          return {
            line: line !== undefined ? line + 1 : undefined,
            token,
            elementType,
          };
        });
      });
      Mousetrap.bind('left', (e) => {
        e.preventDefault();
        setSelectedToken(({ line, token, elementType }: ISelectedToken) => {
          return {
            line,
            token: token !== undefined ? token + 1 : undefined,
            elementType,
          };
        });
      });
      Mousetrap.bind('right', (e) => {
        e.preventDefault();
        setSelectedToken(({ line, token, elementType }: ISelectedToken) => {
          return {
            line,
            token: token !== undefined && token > 0 ? token - 1 : undefined,
            elementType,
          };
        });
      });
    }

    return () => {
      Mousetrap.reset();
    };
  }, []);

  return (
    <Popper
      open={morphologyPopperOpen}
      anchorEl={morphologyPopperAnchor}
      placement="top"
    >
      <Box
        sx={{ border: 1, p: 1, bgcolor: 'background.paper', width: '300px' }}
      >
        {morphologyData.length === 0 && <p>No Results</p>}
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ width: '100%' }}
          spacing={0.5}
          justifyContent="center"
        >
          {morphologyData.map((d, i) => (
            <Box key={d.Id} sx={{ p: '5px' }}>
              <Typography variant="body2">
                {i + 1}. {d.Word}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Popper>
  );
};
