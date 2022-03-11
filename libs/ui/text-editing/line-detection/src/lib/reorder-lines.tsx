import Stack from '@mui/material/Stack';
import { LineToolCommandBar } from './line-tool-command-bar';
import {
  kalilaTheme,
  Movable,
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
import { flatten, orderBy } from 'lodash';
import { ILineSummaryProps, LineSummary } from './line-summary';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback, useEffect, useState } from 'react';
import update from 'immutability-helper';
import { Update } from '@reduxjs/toolkit/src/entities/models';
import { ILine } from '@frontend/domain';

const toLineContainerIdMap = (urls: Record<string, string>) => {
  return (
    acc: Record<string, ILineSummaryProps[]>,
    l: Omit<ILine, 'Tokens'> & { ElementId: string }
  ) => {
    const item = {
      line: l,
      url: urls[l._id],
      buttons: false,
      maxHeight: '5vh',
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
    Record<string, ILineSummaryProps[]>
  >(lines.reduce(toLineContainerIdMap(urls), {}));

  const move = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      dragContainer: string,
      hoverContainer: string
    ) => {
      setLineToContainerMap((prev) => {
        let updatedMap: Record<string, ILineSummaryProps[]>;
        if (dragContainer === hoverContainer) {
          updatedMap = update(prev, {
            [dragContainer]: {
              $splice: [
                [dragIndex, 1],
                [
                  hoverIndex,
                  0,
                  prev[dragContainer][dragIndex] as ILineSummaryProps,
                ],
              ],
            },
          });
        } else {
          updatedMap = update(prev, {
            [dragContainer]: { $splice: [[dragIndex, 1]] },
            [hoverContainer]: {
              $splice: [
                [dragIndex, 1],
                [
                  hoverIndex,
                  0,
                  prev[dragContainer][dragIndex] as ILineSummaryProps,
                ],
              ],
            },
          });
        }
        const mainLines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> =
          [];
        const otherLines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> =
          [];
        mainBodyElements.forEach((el) =>
          mainLines.push(
            ...updatedMap[el._id].map((l) => ({
              ...l.line,
              ElementId: el._id,
            }))
          )
        );
        otherElements.forEach((el) =>
          otherLines.push(
            ...updatedMap[el._id].map((l) => ({
              ...l.line,
              ElementId: el._id,
            }))
          )
        );
        const updatedLines = [
          ...mainLines.map((l, index) => ({ ...l, LineOrder: index })),
          ...otherLines.map((l, index) => ({ ...l, LineOrder: index })),
        ];
        return updatedLines.reduce(toLineContainerIdMap(urls), {});
      });
    },
    []
  );

  useEffect(() => {
    const updatedLines = flatten(Object.values(lineToContainerMap)).map(
      (p) => p.line
    );
    const updates: Update<Omit<ILine, 'Tokens'> & { ElementId: string }>[] = [];
    updatedLines.forEach((l, index) =>
      updates.push({
        id: l._id,
        changes: { LineOrder: index, ElementId: l.ElementId },
      })
    );

    dispatch(updateManyLines(updates)); // TODO, add to update collector, add an empty drop container
  }, [lineToContainerMap]);

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
          <Stack
            sx={{
              width: '100%',
            }}
            alignItems="center"
            spacing={1}
          >
            <Divider />
            {presentLines.length === 0 && (
              <Typography variant="button">
                No lines defined in this element
              </Typography>
            )}
            {presentLines.map(
              (l, index) =>
                l && (
                  <Movable
                    move={move}
                    index={index}
                    id={l.line._id}
                    style={{ width: '100%' }}
                    key={l.line._id}
                    containerId={el._id}
                  >
                    <LineSummary {...l} />
                  </Movable>
                )
            )}
          </Stack>
        </LayoutElementSummary>
      );
    },
    [lineToContainerMap]
  );

  return (
    <Stack
      sx={{
        mt: '5px',
        width: '100%',
        height: '100%',
        bgcolor: '#DDDDDD',
        overflowY: 'scroll',
      }}
    >
      <LineToolCommandBar />
      <DndProvider backend={HTML5Backend}>
        <Stack
          sx={{
            flexGrow: 1,
            width: '100',
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
      </DndProvider>
    </Stack>
  );
};
