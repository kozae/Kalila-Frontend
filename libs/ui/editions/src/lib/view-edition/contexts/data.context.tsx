import { EditionCellData, EditionRowTitle, EditionStore } from '../../store';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useSignalrEditionUpdates } from '../hooks';
import { useBehaviorOptions } from './behavior-options.context';
import {
  IEditionPageData,
  IEditionPageDataMutators,
  IRealTimeUpdateProps,
} from '../models';

export const DataContext = createContext<
  IEditionPageData & { updateTime: number }
>({
  edition: EditionStore.prototype,
  cells: [],
  rows: [],
  updateTime: 0,
});

export const DataMutatorsContext = createContext<IEditionPageDataMutators>({
  setEdition: (v: EditionStore | ((v: EditionStore) => EditionStore)) => {},
  setRows: (
    v: EditionRowTitle[] | ((v: EditionRowTitle[]) => EditionRowTitle[])
  ) => {},
  setCells: (
    v: EditionCellData[][] | ((v: EditionCellData[][]) => EditionCellData[][])
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
  const [updateTime, setUpdateTime] = useState(Date.now());
  const data = useMemo(
    () => ({ edition, cells, rows, updateTime }),
    [edition, cells, rows, updateTime]
  );
  const { enableRealTimeUpdates } = useBehaviorOptions();
  useSignalrEditionUpdates(
    realTime,
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

  return (
    <DataMutatorsContext.Provider value={{ setCells, setRows, setEdition }}>
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    </DataMutatorsContext.Provider>
  );
};
