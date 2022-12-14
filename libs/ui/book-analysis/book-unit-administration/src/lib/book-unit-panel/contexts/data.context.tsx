import { BookUnit } from '@frontend/domain';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  IBookUnitPanelData,
  IBookUnitPanelDataMethods,
  IBookUnitPanelFilterData,
  IBookUnitPanelFilterMethods,
} from '../models';

const DataContext = createContext<
  IBookUnitPanelData &
    IBookUnitPanelFilterData & { selectedBookUnit: BookUnit | null }
>({
  units: [],
  chapter: null,
  unitTitleFilter: '',
  selectedBookUnit: null,
});

export const useData = () => useContext(DataContext);

const MethodsContext = createContext<
  IBookUnitPanelDataMethods &
    IBookUnitPanelFilterMethods & {
      setSelectedBookUnit?: (v: BookUnit | null) => void;
    }
>({});

export const useDataMethods = () => useContext(MethodsContext);

export const DataProvider: FC<
  { children: ReactNode } & IBookUnitPanelData &
    IBookUnitPanelFilterData &
    IBookUnitPanelDataMethods &
    IBookUnitPanelFilterMethods
> = ({
  children,
  validate,
  create,
  count,
  updateBookUnit,
  onDeleteDivider,
  onDeleteLacunae,
  setChapter,
  setUnitTitleFilter,
  units,
  chapter,
  unitTitleFilter,
}) => {
  const [selectedBookUnit, setSelectedBookUnit] = useState<BookUnit | null>(
    null
  );

  const methods = useMemo(
    () => ({
      validate,
      create,
      count,
      updateBookUnit,
      onDeleteDivider,
      onDeleteLacunae,
      setChapter,
      setUnitTitleFilter,
      setSelectedBookUnit,
    }),
    [
      validate,
      create,
      count,
      updateBookUnit,
      onDeleteDivider,
      onDeleteLacunae,
      setChapter,
      setUnitTitleFilter,
      setSelectedBookUnit,
    ]
  );

  const dataValue = useMemo(
    () => ({ units, chapter, unitTitleFilter, selectedBookUnit }),
    [units, chapter, unitTitleFilter, selectedBookUnit]
  );

  return (
    <MethodsContext.Provider value={methods}>
      <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
    </MethodsContext.Provider>
  );
};
