import Stack from '@mui/material/Stack';
import { LineToolCommandBar } from '../line-tool-command-bar';
import {
  moveLines,
  onRegionHoveredInToolSpace,
  selectAllTextElements,
  selectLinesDictionary,
  selectManyRegionDataUrlById,
  selectTokensDictionary,
  updateManyLines,
  updateManyTokens,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { debounce, orderBy } from 'lodash';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IFacsimileRegion, ILine, IToken } from '@frontend/domain';
import GridLayout, { Layout } from 'react-grid-layout';
import { ITextElementMarkProps, TextElementMark } from './text-element-mark';
import { ISortableLineProps, SortableLine } from './sortable-line';
import { Update } from '@reduxjs/toolkit';

export const toLineContainerIdMap = (urls: Record<string, string>) => {
  return (
    acc: Record<string, ISortableLineProps[]>,
    l: (Omit<ILine, 'Tokens'> & { ElementId: string }) | undefined
  ) => {
    if (l) {
      const item: ISortableLineProps = {
        url: urls[l.Id],
        height: '80px',
        width: '85%',
        ...l,
      };
      if (acc[l.ElementId] === undefined) {
        acc[l.ElementId] = [item];
      } else {
        acc[l.ElementId].push(item);
      }
    }

    return acc;
  };
};

export const ReorderLines = () => {
  const textElements = useAppSelector(selectAllTextElements);
  const dispatch = useAppDispatch();
  const handleHover = (region: (IFacsimileRegion & { Id: string }) | null) =>
    dispatch(onRegionHoveredInToolSpace(region));
  const lines = useAppSelector(selectLinesDictionary);
  const tokens = useAppSelector(selectTokensDictionary);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(state, [
      ...textElements.map((el) => el.Id),
      ...Object.values(lines).map((l) => (l ? l.Id : '')),
    ])
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(200);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef]);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      if (containerRef && containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    }, 10);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  const elementSummaries: Omit<ITextElementMarkProps, 'grid'>[] = orderBy(
    textElements.map((el) => ({
      ...el,
      url: urls[el.Id],
      height: '120px',
      width: '95%',
    })),
    'Order'
  );

  const elementIds = elementSummaries.map((el) => el.Id);

  const mainBodyElements = elementSummaries
    .filter((el) => el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i + 1 }));

  const mainBodyElementIds = mainBodyElements.map((el) => el.Id);

  const otherElements = elementSummaries
    .filter((el) => !el.Position.startsWith('main'))
    .map((el, i) => ({ ...el, Order: i + 1 }));

  const lineToContainerMap = orderBy(Object.values(lines), 'LineOrder').reduce(
    toLineContainerIdMap(urls),
    {}
  );

  const gridContents = useCallback(() => {
    const sep = { isDraggable: false, isResizable: false };
    const main: JSX.Element[] = [];
    let counter = 0;
    mainBodyElements.forEach((el, elIndex) => {
      main.push(
        <Stack
          onMouseEnter={() =>
            handleHover({
              ...el.FacsimileRegion,
              Id: el.Id,
            } as IFacsimileRegion & { Id: string })
          }
          onMouseLeave={() => handleHover(null)}
          alignItems="center"
          key={el.Id}
          data-grid={{ x: 0, y: counter, w: 1, h: 3, ...sep }}
        >
          <TextElementMark {...el} main={true} />
        </Stack>
      );
      counter++;
      if (lineToContainerMap[el.Id] !== undefined) {
        lineToContainerMap[el.Id].forEach((l, lineIndex) => {
          main.push(
            <Stack
              onMouseEnter={() =>
                handleHover({
                  ...l.FacsimileRegion,
                  Id: l.Id,
                } as IFacsimileRegion & { Id: string })
              }
              onMouseLeave={() => handleHover(null)}
              alignItems="center"
              sx={{ cursor: 'grab' }}
              key={l.Id}
              data-grid={{
                x: 0,
                y: counter,
                w: 1,
                h: 2,
                isResizable: false,
              }}
            >
              <SortableLine {...l} />
            </Stack>
          );
          counter++;
        });
      }
    });
    const other: JSX.Element[] = [];
    otherElements.forEach((el, elIndex) => {
      other.push(
        <Stack
          onMouseEnter={() =>
            handleHover({
              ...el.FacsimileRegion,
              Id: el.Id,
            } as IFacsimileRegion & { Id: string })
          }
          onMouseLeave={() => handleHover(null)}
          alignItems="center"
          key={el.Id}
          data-grid={{ x: 0, y: counter, w: 1, h: 3, ...sep }}
        >
          <TextElementMark {...el} />
        </Stack>
      );
      counter++;
      lineToContainerMap[el.Id].forEach((l, lineIndex) => {
        other.push(
          <Stack
            onMouseEnter={() =>
              handleHover({
                ...l.FacsimileRegion,
                Id: l.Id,
              } as IFacsimileRegion & { Id: string })
            }
            onMouseLeave={() => handleHover(null)}
            sx={{ cursor: 'grab' }}
            alignItems="center"
            key={l.Id}
            data-grid={{
              x: 0,
              y: counter,
              w: 1,
              h: 2,
              isResizable: false,
            }}
          >
            <SortableLine {...l} />
          </Stack>
        );
        counter++;
      });
    });

    return [...main, ...other];
  }, [lineToContainerMap]);

  const tokenList = Object.values(tokens);
  const handleOrderChange = (l: Layout[]) => {
    const mainLines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> = [];
    const mainTokens: Array<IToken & { LineId: string }> = [];
    const otherLines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> = [];
    const otherTokens: Array<IToken & { LineId: string }> = [];
    let lastSeenElementMarker: string;
    orderBy(l, 'y').forEach((e) => {
      if (elementIds.includes(e.i)) {
        lastSeenElementMarker = e.i;
      } else {
        const line = lines[e.i];
        if (line) {
          const lineTokens = tokenList.filter(
            (t) => t && t.LineId === line.Id
          ) as Array<IToken & { LineId: string }>;
          if (mainBodyElementIds.includes(lastSeenElementMarker)) {
            mainLines.push({ ...line, ElementId: lastSeenElementMarker });

            mainTokens.push(...lineTokens);
          } else {
            otherLines.push({ ...line, ElementId: lastSeenElementMarker });
            otherTokens.push(...lineTokens);
          }
        }
      }
    });
    const reorderUpdates: Update<
      Omit<ILine, 'Tokens'> & { ElementId: string }
    >[] = [];
    const tokenUpdates: Update<IToken & { LineId: string }>[] = [];
    const moveUpdates: { LineId: string; Target: string; LineOrder: number }[] =
      [];
    const createLineUpdate = (
      updatedLine: Omit<ILine, 'Tokens'> & { ElementId: string },
      index: number
    ) => {
      const originalLine = lines[updatedLine.Id];
      if (
        originalLine &&
        originalLine.LineOrder !== index &&
        originalLine.ElementId === updatedLine.ElementId
      ) {
        reorderUpdates.push({
          id: updatedLine.Id,
          changes: { LineOrder: index },
        });
      } else if (
        originalLine &&
        originalLine.ElementId !== updatedLine.ElementId
      ) {
        moveUpdates.push({
          LineId: updatedLine.Id,
          Target: updatedLine.ElementId,
          LineOrder: index,
        });
      }
    };
    const createTokenUpdates = (
      updatedToken: IToken & { LineId: string },
      index: number
    ) => {
      const originalToken = tokens[updatedToken.Id];
      if (originalToken && originalToken.OrderInPage !== index) {
        tokenUpdates.push({
          id: updatedToken.Id,
          changes: { OrderInPage: index, LineId: originalToken.LineId }, // line id is added only for keeping track
        });
      }
    };
    mainLines.forEach(createLineUpdate);
    otherLines.forEach(createLineUpdate);
    mainTokens.forEach(createTokenUpdates);
    otherTokens.forEach(createTokenUpdates);
    dispatch(updateManyLines(reorderUpdates));
    dispatch(moveLines(moveUpdates));
    dispatch(updateManyTokens(tokenUpdates));
  };

  const createGrid = useCallback(
    () => (
      <GridLayout
        className="layout"
        cols={1}
        rowHeight={40}
        width={containerWidth}
        onLayoutChange={handleOrderChange}
      >
        {gridContents()}
      </GridLayout>
    ),
    [containerWidth, gridContents]
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
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          height: 'fit-content',
          bgcolor: '#DDDDDD',
        }}
        ref={containerRef}
      >
        {createGrid()}
      </Box>
    </Stack>
  );
};
