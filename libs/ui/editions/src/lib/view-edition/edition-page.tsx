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
} from './view-edition-context';
import { useSignalrEditionUpdates } from '../hooks';
import { getCells, getRows } from './helpers';

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
  const [size, setSize] = useState<EditionFontSize>('s');
  const [font, setFont] = useState<EditionFontFamily>('n');
  const [updateTime, setUpdateTime] = useState(Date.now());
  const [facsimilePreview, setFacsimilePreview] = useState<boolean>(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(false);
  const [structureViz, setStructureViz] = useState<boolean>(false);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    size: edition.get_no_rows() * 2,
    parentRef,
  });

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

  useEffect(() => {
    return () => {
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
    setUpdateTime
  );

  return (
    <>
      <ViewEditionContext.Provider
        value={{
          size,
          font,
          setSize,
          setFont,
          facsimilePreview,
          setFacsimilePreview,
          structureViz,
          setStructureViz,
          realTimeUpdates,
          setRealTimeUpdates,
        }}
      >
        <Portal>
          <EditionCommandBar />
        </Portal>
        <div
          ref={parentRef}
          style={{
            maxWidth: '100%',
            height: 'calc(100vh - 110px)',
            overflow: 'auto',
          }}
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
      </ViewEditionContext.Provider>
    </>
  );
};
