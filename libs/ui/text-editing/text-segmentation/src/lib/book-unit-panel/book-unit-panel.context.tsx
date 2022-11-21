import { BookUnit, IChapter } from '@frontend/domain';
import { createContext } from 'react';
import { KeyedMutator } from 'swr';
import { IPagination } from '@frontend/util';

export interface IBookUnitPanelContextValue {
  chapter: IChapter | null;
  filter: string;
  createUnitDialogOpen: boolean;
  editBookUnitDialogIsOpen: boolean;
  editFrameDialogIsOpen: boolean;
  selectedBookUnit: BookUnit | null;
  setChapter: (v: IChapter | null) => void;
  setFilter: (v: string) => void;
  setCreateUnitDialogOpen: (v: boolean) => void;
  setEditBookUnitDialogIsOpen: (v: boolean) => void;
  setEditFrameDialogIsOpen: (v: boolean) => void;
  setSelectedBookUnit: (v: BookUnit | null) => void;
  refetchUnits: KeyedMutator<{
    content: any;
    pagination: IPagination | undefined;
  }> | null;
}

export const BookUnitPanelContext = createContext<IBookUnitPanelContextValue>({
  chapter: null,
  filter: '',
  createUnitDialogOpen: false,
  editBookUnitDialogIsOpen: false,
  editFrameDialogIsOpen: false,
  selectedBookUnit: null,
  setChapter: (v: IChapter | null) => {},
  setFilter: (v: string) => {},
  setCreateUnitDialogOpen: (v: boolean) => {},
  setEditBookUnitDialogIsOpen: (v: boolean) => {},
  setEditFrameDialogIsOpen: (v: boolean) => {},
  setSelectedBookUnit: (v: BookUnit | null) => {},
  refetchUnits: null,
});
