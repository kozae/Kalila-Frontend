import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  IBookUnitPanelAuxiliarySurfacesData,
  IBookUnitPanelAuxiliarySurfacesMethods,
} from '../models';

const DataContext = createContext<IBookUnitPanelAuxiliarySurfacesData>({
  createUnitDialogOpen: false,
  editBookUnitDialogIsOpen: false,
  editFrameDialogIsOpen: false,
});

export const useAuxiliarySurfacesData = () => useContext(DataContext);

const MethodsContext = createContext<IBookUnitPanelAuxiliarySurfacesMethods>({
  setCreateUnitDialogOpen: (v: boolean) => {},
  setEditBookUnitDialogIsOpen: (v: boolean) => {},
  setEditFrameDialogIsOpen: (v: boolean) => {},
});

export const useAuxiliarySurfacesMethods = () => useContext(MethodsContext);

export const AuxiliarySurfacesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [createUnitDialogOpen, setCreateUnitDialogOpen] =
    useState<boolean>(false);
  const [editBookUnitDialogIsOpen, setEditBookUnitDialogIsOpen] =
    useState<boolean>(false);
  const [editFrameDialogIsOpen, setEditFrameDialogIsOpen] =
    useState<boolean>(false);

  const data = useMemo(
    () => ({
      createUnitDialogOpen,
      editBookUnitDialogIsOpen,
      editFrameDialogIsOpen,
    }),
    [createUnitDialogOpen, editBookUnitDialogIsOpen, editFrameDialogIsOpen]
  );

  const methods = useMemo(
    () => ({
      setCreateUnitDialogOpen,
      setEditBookUnitDialogIsOpen,
      setEditFrameDialogIsOpen,
    }),
    [
      setCreateUnitDialogOpen,
      setEditBookUnitDialogIsOpen,
      setEditFrameDialogIsOpen,
    ]
  );

  return (
    <MethodsContext.Provider value={methods}>
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    </MethodsContext.Provider>
  );
};
