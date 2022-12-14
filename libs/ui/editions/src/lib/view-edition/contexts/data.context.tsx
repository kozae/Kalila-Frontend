import { EditionCellData, EditionRowTitle, EditionStore } from '../../store';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMemoryFreeingOnDismount, useSignalrEditionUpdates } from '../hooks';
import { useBehaviorOptions } from './behavior-options.context';
import {
  IEditionPageData,
  IEditionPageDataMutators,
  IRealTimeUpdateProps,
  RowVirtualizer,
} from '../models';
import { useVirtual } from 'react-virtual';

export const DataContext = createContext<
  IEditionPageData & {
    updateTime: number;
    previewCache: Record<string, string>;
    rowVirtualizer: RowVirtualizer | null;
    collationParentRef: RefObject<HTMLDivElement> | null;
  }
>({
  edition: EditionStore.prototype,
  cells: [],
  rows: [],
  updateTime: 0,
  previewCache: {},
  rowVirtualizer: null,
  collationParentRef: null,
});

export const DataMutatorsContext = createContext<
  IEditionPageDataMutators & {
    setPreviewCache: Dispatch<SetStateAction<Record<string, string>>>;
  }
>({
  setEdition: (v: EditionStore | ((v: EditionStore) => EditionStore)) => {},
  setRows: (
    v: EditionRowTitle[] | ((v: EditionRowTitle[]) => EditionRowTitle[])
  ) => {},
  setCells: (
    v: EditionCellData[][] | ((v: EditionCellData[][]) => EditionCellData[][])
  ) => {},
  setPreviewCache: (
    v:
      | Record<string, string>
      | ((v: Record<string, string>) => Record<string, string>)
  ) => {},
});

export const useData = () => useContext(DataContext);
export const useDataMutators = () => useContext(DataMutatorsContext);

export const DataProvider: FC<
  { children: ReactNode } & IEditionPageData &
    IEditionPageDataMutators & { realTime: IRealTimeUpdateProps }
> = ({
  children,
  edition,
  cells,
  rows,
  setEdition,
  setCells,
  setRows,
  realTime,
}) => {
  const [updateTime, setUpdateTime] = useState(-1);
  const [previewCache, setPreviewCache] = useState<Record<string, string>>({});
  const collationParentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    size: edition.get_no_rows() * 2,
    parentRef: collationParentRef,
  });

  const data = useMemo(
    () => ({
      edition,
      cells,
      rows,
      updateTime,
      previewCache,
      collationParentRef,
      rowVirtualizer,
    }),
    [
      edition,
      cells,
      rows,
      updateTime,
      previewCache,
      collationParentRef,
      rowVirtualizer,
      rowVirtualizer.virtualItems,
    ]
  );
  const { enableRealTimeUpdates } = useBehaviorOptions();

  useSignalrEditionUpdates(
    realTime,
    rowVirtualizer,
    {
      edition,
      setEdition,
      rows,
      cells,
      setRows,
      setCells,
    },
    setUpdateTime,
    enableRealTimeUpdates
  );

  useMemoryFreeingOnDismount(edition, rows, cells);

  return (
    <DataMutatorsContext.Provider
      value={{ setCells, setRows, setEdition, setPreviewCache }}
    >
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    </DataMutatorsContext.Provider>
  );
};
