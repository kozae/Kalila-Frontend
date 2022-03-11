import Stack from '@mui/material/Stack';
import { LineToolCommandBar } from './line-tool-command-bar';
import {
  kalilaTheme,
  selectAllLines,
  selectAllTextElements,
  selectManyRegionDataUrlById,
  updateManyLines,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import {
  ILayoutElementSummaryProps,
  LayoutElementSummary,
} from '@frontend/ui/text-editing/shared';
import { debounce, flatten, orderBy } from 'lodash';
import { ILineSummaryProps, LineSummary } from './line-summary';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useRef, useState } from 'react';
import update from 'immutability-helper';
import { Update } from '@reduxjs/toolkit/src/entities/models';
import { ILine } from '@frontend/domain';

const toLineContainerIdMap = (urls: Record<string, string>) => {
  return (
    acc: Record<string, { summaryProps: ILineSummaryProps }[]>,
    l: Omit<ILine, 'Tokens'> & { ElementId: string },
    index: number
  ) => {
    const item: { summaryProps: ILineSummaryProps } = {
      summaryProps: {
        line: l,
        url: urls[l._id],
        buttons: false,
        maxHeight: '40px',
      },
    };
    if (acc[l.ElementId] === undefined) {
      acc[l.ElementId] = [item];
    } else {
      acc[l.ElementId].push(item);
    }
    return acc;
  };
};

export const ReorderLines = () => {
  const textElements = useAppSelector(selectAllTextElements);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectAllLines);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(state, [
      ...textElements.map((el) => el._id),
      ...lines.map((l) => l._id),
    ])
  );

  const elementSummaries: ILayoutElementSummaryProps[] = orderBy(
    textElements.map((el) => ({
      ...el,
      url: urls[el._id],
      icon: 'text',
      maxHeight: '5vh',
      width: '90%',
      buttons: false,
      color: kalilaTheme.palette.secondary.dark,
    })),
    'Order'
  );

  const mainBodyElements = elementSummaries
    .filter((el) => el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i + 1 }));

  const otherElements = elementSummaries
    .filter((el) => !el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i + 1 }));

  const [lineToContainerMap, setLineToContainerMap] = useState<
    Record<string, { summaryProps: ILineSummaryProps }[]>
  >(lines.reduce(toLineContainerIdMap(urls), {}));

  const createElementLineList = useCallback(
    (el: ILayoutElementSummaryProps) => {
      const presentLines = lineToContainerMap[el._id];
      const title =
        presentLines.length === 0
          ? 'no lines'
          : presentLines.length > 1
          ? `[${presentLines.length} lines]`
          : '[one line]';
      return (
        <LayoutElementSummary key={el._id} {...el} title={title}>
          <Stack>
            {presentLines.length === 0 && (
              <Typography variant="button">
                No lines defined in this element
              </Typography>
            )}
            {presentLines.map(
              (l, index) => l && <LineSummary {...l.summaryProps} />
            )}
          </Stack>
        </LayoutElementSummary>
      );
    },
    [lineToContainerMap]
  );

  return (
    <Stack
      ref={containerRef}
      sx={{
        mt: '5px',
        width: '100%',
        height: '100%',
        bgcolor: '#DDDDDD',
        overflowY: 'scroll',
      }}
    >
      <LineToolCommandBar />
      <Stack
        sx={{
          flexGrow: 1,
          width: '100%',
          height: 'fit-content',
          bgcolor: '#DDDDDD',
        }}
        alignItems="center"
      >
        <Box sx={{ pt: '5px' }}>
          <Typography variant="h2">
            Main text, {mainBodyElements.length}
            {mainBodyElements.length > 1 ? ' elements' : ' element'}
          </Typography>
        </Box>
        {mainBodyElements.map(createElementLineList)}
        <Box sx={{ pt: '5px' }}>
          <Typography variant="h2">
            Glosses, legends, and marginalia, {otherElements.length}
            {otherElements.length > 1 ? ' elements' : ' element'}
          </Typography>
        </Box>
        {otherElements.map(createElementLineList)}
      </Stack>
    </Stack>
  );
};
