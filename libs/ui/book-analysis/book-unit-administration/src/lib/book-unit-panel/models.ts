import {
  IBookUnit,
  IChapter,
  IFrameUpdate,
  IStructureUpdate,
} from '@frontend/domain';
import { Dispatch, SetStateAction } from 'react';

export interface IBookUnitPanelUIOptions {
  accessMode?: 'edit' | 'tag' | 'admin';
  verticalAnimate?: boolean;
}

export interface IBookUnitPanelData {
  units: (IBookUnit & { ManuscriptInfo: string | null })[];
}

export interface IBookUnitPanelDataMethods {
  validate?: (params: any) => Promise<boolean>;
  create?: (unit: Partial<IBookUnit>) => Promise<any>;
  updateBookUnit?: (
    params: any,
    updateStructure?: IStructureUpdate,
    updateFrame?: IFrameUpdate
  ) => Promise<any>;
  onDeleteBookUnit?: (id: string) => Promise<any>;
  onDeleteDivider?: (id: string) => Promise<any>;
  onDeleteLacunae?: (id: string, msId: string) => void;
  count?: (params: any) => Promise<number | undefined>;
}

export interface IBookUnitPanelFilterMethods {
  setChapter?: Dispatch<SetStateAction<IChapter | null>>;
  setUnitTitleFilter?: Dispatch<SetStateAction<string>>;
}

export interface IBookUnitPanelFilterData {
  chapter: IChapter | null;
  unitTitleFilter: string;
}

export interface IBookUnitPanelAuxiliarySurfacesData {
  createUnitDialogOpen: boolean;
  editBookUnitDialogIsOpen: boolean;
  editFrameDialogIsOpen: boolean;
}

export interface IBookUnitPanelAuxiliarySurfacesMethods {
  setCreateUnitDialogOpen: (v: boolean) => void;
  setEditBookUnitDialogIsOpen: (v: boolean) => void;
  setEditFrameDialogIsOpen: (v: boolean) => void;
}

export type IBookUnitPanelProps = IBookUnitPanelUIOptions &
  IBookUnitPanelData &
  IBookUnitPanelDataMethods &
  IBookUnitPanelFilterMethods &
  IBookUnitPanelFilterData;
