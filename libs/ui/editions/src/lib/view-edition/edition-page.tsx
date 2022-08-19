import { IEdition } from '@frontend/domain';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useVirtual, VirtualItem } from 'react-virtual';
import { EditionUnitTitle } from './edition-unit-title';
import { EditionManuscriptBar } from './edition-manuscript-bar';
import { EditionRow } from './edition-row';
import dynamic from 'next/dynamic';
import { EditionCellData, EditionRowTitle, EditionStore } from '../store';
import Portal from '@mui/material/Portal';
import { EditionCommandBar } from './edition-command-bar';
import {
  EditionFontFamily,
  EditionFontSize,
  WIDTH_OPTIONS,
  ViewEditionContext,
  ILinePreviewData,
} from './view-edition-context';
import { useSignalrEditionUpdates } from '../hooks';
import { getCells, getRows } from './helpers';
import { LinePreview, LinePreviewDynamic } from './line-preview';
import { AnimatePresence, motion } from 'framer-motion';
import {
  disableMaxWidth,
  enableMaxWidth,
  selectNavControlBarIsShown,
  useAppDispatch,
  useAppSelector,
  useXLargeScreenMediaQuery,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import {
  EditionStructureViz,
  getEditionContainerStyle,
  getStructureVizContainerProps,
  getUnitPreviewMotionProps,
  getUnitPreviewStyle,
} from './structure';
import { StructurePositions } from './structure/render';
import Typography from '@mui/material/Typography';

export const EditionPageWasm = dynamic({
  loader: async () => {
    const { EditionStore } = await import('../store');
    return ({ data }: { data: IEdition }) => {
      const [edition, setEdition] = useState(EditionStore.load(data));
      const [rows, setRows] = useState(getRows(edition));
      const [cells, setCells] = useState(getCells(edition));
      return (
        <EditionPage
          {...{ edition, rows, cells, setCells, setRows, setEdition }}
        />
      );
    };
  },
});

export interface IEditionPageProps {
  edition: EditionStore;
  setEdition: Dispatch<SetStateAction<EditionStore>>;
  cells: EditionCellData[][];
  rows: EditionRowTitle[];
  setRows: Dispatch<SetStateAction<EditionRowTitle[]>>;
  setCells: Dispatch<SetStateAction<EditionCellData[][]>>;
}

export const EditionPage = ({
  edition,
  setEdition,
  cells,
  rows,
  setCells,
  setRows,
}: IEditionPageProps) => {
  const [size, setSize] = useState<EditionFontSize>('xs');
  const [font, setFont] = useState<EditionFontFamily>('n');
  const [updateTime, setUpdateTime] = useState(Date.now());
  const [enableFacsimilePreview, setEnableFacsimilePreview] =
    useState<boolean>(false);
  const [activeLinePreview, setActiveLinePreview] =
    useState<ILinePreviewData | null>(null);
  const [linePreviews, setLinePreviews] = useState<Record<string, string>>({});
  const [unitPreview, setUnitPreview] = useState<
    [number, number, number] | null
  >(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(true);
  const [structureViz, setStructureViz] = useState<StructurePositions | null>(
    null
  );
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

  const showNavbar = useAppSelector(selectNavControlBarIsShown);
  const numberOfManuscripts = useMemo(
    () => edition.get_no_manuscripts(),
    [edition]
  );
  const getRow = useCallback(
    (row: VirtualItem) => {
      const unitIndex = Math.floor(row.index / 2);
      const key = `${row.index}.${size}.${font}`;
      if (row.index % 2 === 0) {
        return (
          <div
            key={key}
            ref={row.measureRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
            }}
          >
            {rows[unitIndex] && <EditionUnitTitle data={rows[unitIndex]} />}
          </div>
        );
      }
      return (
        <div
          key={key}
          ref={row.measureRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${row.start}px)`,
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          {cells[unitIndex] && (
            <EditionRow
              manuscripts={numberOfManuscripts}
              data={cells[unitIndex]}
            />
          )}
        </div>
      );
    },
    [edition, rows, cells, font, size]
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(enableMaxWidth());
    return () => {
      dispatch(disableMaxWidth());
      edition.free();
      rows.forEach((row) => row.free());
      cells.forEach((row) => row.forEach((cell) => cell.free()));
    };
  }, []);

  const getWidth = useCallback(() => {
    const cellWidth = WIDTH_OPTIONS[size];
    return cellWidth * numberOfManuscripts;
  }, [size, numberOfManuscripts]);

  useSignalrEditionUpdates(
    {
      edition,
      setEdition,
      rows,
      cells,
      setRows,
      setCells,
    },
    setUpdateTime,
    realTimeUpdates
  );

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

  return (
    <>
      <ViewEditionContext.Provider
        value={{
          size,
          font,
          setSize,
          setFont,
          enableFacsimilePreview,
          setEnableFacsimilePreview,
          structureViz,
          setStructureViz,
          realTimeUpdates,
          setRealTimeUpdates,
          activeLinePreview,
          setActiveLinePreview,
        }}
      >
        <Portal>
          <EditionCommandBar editionName={edition.get_name()} />
        </Portal>
        <Portal>
          <AnimatePresence exitBeforeEnter>
            {activeLinePreview && (
              <motion.div
                key={`${activeLinePreview.manuscriptSiglum}_${activeLinePreview.page}_${activeLinePreview.line}`}
                style={{
                  position: 'fixed',
                  top: 10,
                  right: '25%',
                  zIndex: 90,
                  width: isXLScreen ? '800px' : '70%',
                  height: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: 'easeIn' }}
              >
                {getLinePreview(activeLinePreview)}
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
                  backgroundColor: 'rgb(255,103,0)',
                  padding: '10px',
                  borderRadius: '5px',
                }}
                {...getUnitPreviewMotionProps()}
              >
                <Typography color="white" letterSpacing="1px" variant="h2">
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
                key={`${updateTime}`}
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
                unitMatrix={Array(edition.get_no_manuscripts())
                  .fill(0)
                  .map((_, i) => [...edition.get_ms_unit_presence_array(i)])}
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
      </ViewEditionContext.Provider>
    </>
  );
};
