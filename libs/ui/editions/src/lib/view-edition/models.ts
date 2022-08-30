import { StructurePositions } from './structure/render';
import { Dispatch, SetStateAction } from 'react';
import { EditionCellData, EditionRowTitle, EditionStore } from '../store';
import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionUnit } from '@frontend/domain';

export interface ILinePreviewData {
  manuscriptSiglum: string;
  manuscriptIdx: number;
  page: number;
  line: number;
  x: number;
  y: number;
}

export interface IImagePreviewData {
  manuscriptSiglum: string;
  manuscriptIdx: number;
  page: number;
  unitIdx: number;
  x: number;
  y: number;
}

export interface IBehaviorOptions {
  enableFacsimilePreview: boolean;
  isSearchActive: boolean;
  activeLinePreview: ILinePreviewData | null;
  activeImagePreview: IImagePreviewData | null;
  enableRealTimeUpdates: boolean;
  structureViz: StructurePositions | null;
}

export interface IBehaviorOptionsMethods {
  setEnableFacsimilePreview: Dispatch<SetStateAction<boolean>>;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
  setEnableRealTimeUpdates: Dispatch<SetStateAction<boolean>>;
  setActiveLinePreview: Dispatch<SetStateAction<ILinePreviewData | null>>;
  setActiveImagePreview: Dispatch<SetStateAction<IImagePreviewData | null>>;
  setStructureViz: Dispatch<SetStateAction<StructurePositions | null>>;
}

export interface IEditionPageData {
  edition: EditionStore;
  cells: EditionCellData[][];
  rows: EditionRowTitle[];
}

export interface IEditionPageDataMutators {
  setEdition: Dispatch<SetStateAction<EditionStore>>;
  setRows: Dispatch<SetStateAction<EditionRowTitle[]>>;
  setCells: Dispatch<SetStateAction<EditionCellData[][]>>;
}

export type EditionFontSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type EditionFontFamily = 'n' | 'sh' | 'a' | 'm' | 'ns';

export interface IEditionPageAppOptions {
  username: string | undefined;
  showNavbar: boolean;
}

export interface IEditionPageAppOptionMutators {
  setShowNavbar: (v: boolean) => void | Promise<void>;
  disableMaxWidth: () => void | Promise<void>;
  enableMaxWidth: () => void | Promise<void>;
}

export interface ILayoutOptions {
  size: EditionFontSize;
  font: EditionFontFamily;
}
export interface ILayoutOptionsMethods {
  setSize: Dispatch<SetStateAction<EditionFontSize>>;
  setFont: Dispatch<SetStateAction<EditionFontFamily>>;
}

export type RowSearchResult = [number, number, number][];
export type TokenSearchResult = [number, number, number, number][];

export type SearchResults = RowSearchResult | TokenSearchResult | null;

export interface ISearchData {
  filter: string;
  searchResults: SearchResults;
  currentSearchResult: number;
}

export interface ISearchMethods {
  setFilter: Dispatch<SetStateAction<string>>;
  setSearchResults: Dispatch<SetStateAction<SearchResults>>;
  setCurrentSearchResult: Dispatch<SetStateAction<number>>;
}

export interface IRealTimeUpdateProps {
  update?: any;
  fetchEditionUpdateByUnitList?: (
    editionId: string,
    updateInfo: IPageUnitsUpdate
  ) => Promise<IEditionUnit[]>;
  fetchEditionUpdateByPage?: (
    editionId: string,
    manuscriptId: string,
    pageNumber: number
  ) => Promise<IEditionUnit[]>;
}
