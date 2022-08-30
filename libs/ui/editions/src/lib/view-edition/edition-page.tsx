import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtual } from 'react-virtual';
import { EditionManuscriptBar } from './edition-manuscript-bar';
import Portal from '@mui/material/Portal';
import { EditionCommandBar } from './edition-command-bar';
import { LinePreview, LinePreviewDynamic } from './line-preview';
import { AnimatePresence, motion } from 'framer-motion';
import { useXLargeScreenMediaQuery } from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import {
  EditionStructureViz,
  getEditionContainerStyle,
  getStructureVizContainerProps,
  getUnitPreviewMotionProps,
  getUnitPreviewStyle,
} from './structure';
import Typography from '@mui/material/Typography';
import {
  getFacsimilePreviewMotionProps,
  getFacsimilePreviewStyle,
} from './line-preview.helpers';
import { ImagePreviewDynamic } from './image-preview';
import Modal from '@mui/material/Modal';
import {
  horizontalCollationModalStyle,
  UnitHorizontalCollationModal,
} from './edition-unit-horizontal-collation-modal';
import Box from '@mui/material/Box';
import {
  EditionUnitImageCycleModal,
  unitImageCycleModalStyle,
} from './edition-unit-image-cycle-modal';
import { chunk, orderBy, range } from 'lodash';
import { floatRegEx, latinLettersRegex, stringHasValue } from '@frontend/util';
import {
  useBehaviorOptions,
  useBehaviorOptionsMethods,
  useData,
  useLayoutOptions,
  useLayoutOptionsMethods,
  useSearchData,
  useSearchMethods,
} from './contexts';
import { useRowGetter } from './hooks';
import { IImagePreviewData, ILinePreviewData } from './models';
import { WIDTH_OPTIONS } from './constants';

export const EditionPage = () => {
  const [horizontalCollation, setHorizontalCollation] = useState<number | null>(
    null
  );
  const [visibleImageCycle, setVisibleImageCycle] = useState<number | null>(
    null
  );
  const [linePreviews, setLinePreviews] = useState<Record<string, string>>({});
  const [unitPreview, setUnitPreview] = useState<
    [number, number, number] | null
  >(null);
  const { username, font, size, showNavbar } = useLayoutOptions();
  const { enableMaxWidth, disableMaxWidth, setShowNavbar } =
    useLayoutOptionsMethods();
  const { activeLinePreview, activeImagePreview, structureViz } =
    useBehaviorOptions();
  const { setEnableRealTimeUpdates } = useBehaviorOptionsMethods();
  const { edition, rows, cells, updateTime } = useData();
  const { filter, searchResults, currentSearchResult } = useSearchData();
  const { setCurrentSearchResult, setSearchResults } = useSearchMethods();
  const isXLScreen = useXLargeScreenMediaQuery();
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    size: edition.get_no_rows() * 2,
    parentRef,
  });

  const currentRow = useMemo(() => {
    if (rowVirtualizer && rowVirtualizer.virtualItems.length !== 0) {
      return Math.ceil(rowVirtualizer.virtualItems[0].index / 2);
    }
    return 0;
  }, [rowVirtualizer.virtualItems]);

  const numberOfManuscripts = useMemo(
    () => edition.get_no_manuscripts(),
    [edition]
  );
  const getRow = useRowGetter({
    edition,
    rows,
    cells,
    numberOfManuscripts,
    font,
    size,
    setHorizontalCollation,
    setVisibleImageCycle,
  });
  useEffect(() => {
    enableMaxWidth();
    return () => {
      disableMaxWidth();
      edition.free();
      rows.forEach((row) => row.free());
      cells.forEach((row) => row.forEach((cell) => cell.free()));
    };
  }, []);

  const getWidth = useCallback(() => {
    const cellWidth = WIDTH_OPTIONS[size];
    return cellWidth * numberOfManuscripts;
  }, [size, numberOfManuscripts]);

  const getLinePreview = useCallback(
    (data: ILinePreviewData) => {
      const lineKey = `${data.manuscriptSiglum}_${data.page}_${data.line}`;
      if (linePreviews[lineKey]) {
        return <LinePreview url={linePreviews[lineKey]} lineKey={lineKey} />;
      } else {
        return (
          <LinePreviewDynamic
            data={data}
            edition={edition}
            setLinePreviews={setLinePreviews}
          />
        );
      }
    },
    [edition, setLinePreviews, linePreviews]
  );

  const getImagePreview = useCallback(
    (data: IImagePreviewData) => {
      return <ImagePreviewDynamic data={data} edition={edition} />;
    },
    [edition]
  );
  useEffect(() => {
    if (username && username.includes('guest')) {
      setEnableRealTimeUpdates(false);
    }
  }, [username]);

  useEffect(() => {
    if (stringHasValue(filter)) {
      setSearchResults(null);
      setCurrentSearchResult(0);
      const unitTitleSearch = latinLettersRegex.test(filter);
      const unitNumberSearch = floatRegEx.test(filter);
      if (unitNumberSearch) {
        const order = parseFloat(filter);
        const unitIdx = edition.find_unit_by_order(order);
        if (unitIdx) {
          setSearchResults([[unitIdx, -1, -1]]);
          rowVirtualizer.scrollToIndex(unitIdx * 2, { align: 'start' });
        }
      } else if (unitTitleSearch && filter.length > 2) {
        const results = chunk(
          edition.find_unit_by_title(filter.toLowerCase()),
          3
        ) as [number, number, number][];
        if (results.length !== 0) {
          setSearchResults(results);
          const firstResult = results[0][0];
          rowVirtualizer.scrollToIndex(firstResult * 2, { align: 'start' });
        }
      } else if (filter.length > 2) {
        let results = chunk(edition.find_words(filter.trim()), 4) as
          | [number, number, number, number][]
          | undefined;
        if (results && results.length !== 0) {
          results = orderBy(results, (r) => r[2]);
          results = orderBy(results, (r) => r[1], ['desc']);
          results = orderBy(results, (r) => r[0]);
          setSearchResults(results);
          const firstResult = results[0][0];
          rowVirtualizer.scrollToIndex(firstResult * 2, { align: 'start' });
        } else {
          setSearchResults(null);
          setCurrentSearchResult(0);
        }
      }
    } else {
      setSearchResults(null);
      setCurrentSearchResult(0);
    }
  }, [filter]);
  const memoSearchResults = useMemo(() => searchResults, [searchResults]);
  useEffect(() => {
    if (memoSearchResults) {
      const currentRow = memoSearchResults[currentSearchResult][0];
      rowVirtualizer.scrollToIndex(currentRow * 2, { align: 'start' });
    }
  }, [currentSearchResult]);

  return (
    <>
      <Portal>
        <EditionCommandBar
          editionName={edition.get_name()}
          username={username}
          showNavbar={showNavbar}
          setShowNavbar={setShowNavbar}
          onNextSearchResult={() => {
            setCurrentSearchResult((prev) => {
              if (searchResults && prev < searchResults.length - 1) {
                return prev + 1;
              }
              return 0;
            });
          }}
          onPrevSearchResult={() => {
            setCurrentSearchResult((prev) => {
              if (prev > 0) {
                return prev - 1;
              }
              return searchResults ? searchResults.length - 1 : 0;
            });
          }}
        />
      </Portal>
      <Portal>
        <Modal
          sx={{
            zIndex: 10,
          }}
          open={horizontalCollation != null}
          onClose={() => setHorizontalCollation(null)}
        >
          <Box sx={horizontalCollationModalStyle(showNavbar)}>
            {horizontalCollation != null && (
              <UnitHorizontalCollationModal
                onDismiss={() => {
                  setHorizontalCollation(null);
                }}
                data={cells[horizontalCollation]}
                unitTitle={rows[horizontalCollation].get_display()}
                sigla={edition.get_ms_sigla().split(',')}
              />
            )}
          </Box>
        </Modal>
        <Modal
          sx={{
            zIndex: 10,
          }}
          open={visibleImageCycle != null}
          onClose={() => setVisibleImageCycle(null)}
        >
          <Box sx={unitImageCycleModalStyle(showNavbar)}>
            {visibleImageCycle && (
              <EditionUnitImageCycleModal
                sigla={edition.get_ms_sigla().split(',')}
                unitIdx={visibleImageCycle}
                edition={edition}
                unitTitle={rows[visibleImageCycle].get_display()}
                onDismiss={() => setVisibleImageCycle(null)}
              />
            )}
          </Box>
        </Modal>
      </Portal>
      <Portal>
        <AnimatePresence exitBeforeEnter>
          {activeLinePreview && (
            <motion.div
              key={`${activeLinePreview.manuscriptSiglum}_${activeLinePreview.page}_${activeLinePreview.line}`}
              style={getFacsimilePreviewStyle(activeLinePreview, isXLScreen)}
              {...getFacsimilePreviewMotionProps(activeLinePreview)}
            >
              {getLinePreview(activeLinePreview)}
            </motion.div>
          )}
          {activeImagePreview && (
            <motion.div
              key={`${activeImagePreview.manuscriptSiglum}_${activeImagePreview.unitIdx}`}
              style={getFacsimilePreviewStyle(
                activeImagePreview,
                isXLScreen,
                '500px',
                550
              )}
              {...getFacsimilePreviewMotionProps(activeImagePreview, 550)}
            >
              {getImagePreview(activeImagePreview)}
            </motion.div>
          )}
          {structureViz && unitPreview && (
            <motion.div
              key={`${unitPreview[0]}_${unitPreview[1]}_${unitPreview[2]}`}
              style={{
                ...getUnitPreviewStyle(
                  unitPreview[1],
                  unitPreview[2],
                  structureViz
                ),
                position: 'fixed',
                zIndex: 90,
                backgroundColor: '#ffd899',
                padding: '10px',
                borderRadius: '5px',
              }}
              {...getUnitPreviewMotionProps()}
            >
              <Typography color="black" fontSize="1.3rem">
                {rows[unitPreview[0]].get_display()}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
      <Stack
        direction={structureViz === 'bottom' ? 'column-reverse' : 'row'}
        width="100%"
        justifyContent={
          structureViz && structureViz.startsWith('left')
            ? 'space-between'
            : 'center'
        }
        alignItems="center"
      >
        {structureViz && (
          <Stack {...getStructureVizContainerProps(structureViz, showNavbar)}>
            <EditionStructureViz
              searchResults={searchResults}
              key={`${updateTime}`}
              showNavbar={showNavbar}
              onRowClicked={(r) =>
                rowVirtualizer.scrollToIndex(r, { align: 'start' })
              }
              onRowHovered={(r, x, y) => {
                if (r === -1) {
                  setUnitPreview(null);
                } else {
                  setUnitPreview([r, x, y]);
                }
              }}
              currentRow={currentRow}
              position={structureViz}
              unitMatrix={range(edition.get_no_manuscripts()).map((i) => [
                ...edition.get_ms_unit_presence_array(i),
              ])}
              imageMatrix={range(edition.get_no_manuscripts()).map((i) => [
                ...edition.get_ms_image_presence_array(i),
              ])}
              NoUnits={edition.get_no_rows()}
              sigla={edition.get_ms_sigla().split(',')}
            />
          </Stack>
        )}
        <div
          ref={parentRef}
          style={getEditionContainerStyle(structureViz, showNavbar)}
        >
          <EditionManuscriptBar
            manuscripts={numberOfManuscripts}
            store={edition}
          />
          <div
            key={`${size}.${font}.${updateTime}`}
            style={{
              height: rowVirtualizer.totalSize,
              width: `${getWidth()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.virtualItems.map(getRow)}
          </div>
        </div>
      </Stack>
    </>
  );
};
