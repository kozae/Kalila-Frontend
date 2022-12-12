import { Dispatch, SetStateAction } from 'react';
import { EditionCellData, EditionRowTitle, EditionStore } from '../store';
import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionBookUnit, IEditionUnit } from '@frontend/domain';
import { fabric } from 'fabric';
import { VirtualItem } from 'react-virtual';

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

export interface IPagePreviewData {
  manuscriptSiglum: string;
  manuscriptIdx: number;
  page: number;
  x: number;
  y: number;
}

export interface IBehaviorOptions {
  enableFacsimilePreview: boolean;
  isSearchActive: boolean;
  enableRealTimeUpdates: boolean;
  mapState: MapPosition | null;
  visibleUnitInfo: number | null;
}

export interface IBehaviorOptionsMethods {
  setEnableFacsimilePreview: Dispatch<SetStateAction<boolean>>;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
  setEnableRealTimeUpdates: Dispatch<SetStateAction<boolean>>;
  setMapState: Dispatch<SetStateAction<MapPosition | null>>;
  setVisibleUnitInfo: Dispatch<SetStateAction<number | null>>;
}

export interface IAuxiliarySurfacesData {
  activePagePreview: IPagePreviewData | null;
  activeLinePreview: ILinePreviewData | null;
  activeImagePreview: IImagePreviewData | null;
  activeUnitPreview: [number, number, number] | null;
  visibleHorizontalTextCollation: number | null;
  visibleImageCollation: number | null;
  showSearchHints: boolean;
}

export interface IAuxiliarySurfacesMethods {
  setActivePagePreview: Dispatch<SetStateAction<IPagePreviewData | null>>;
  setActiveLinePreview: Dispatch<SetStateAction<ILinePreviewData | null>>;
  setActiveImagePreview: Dispatch<SetStateAction<IImagePreviewData | null>>;
  setActiveUnitPreview: Dispatch<
    SetStateAction<[number, number, number] | null>
  >;
  setVisibleHorizontalTextCollation: Dispatch<SetStateAction<number | null>>;
  setVisibleImageCollation: Dispatch<SetStateAction<number | null>>;
  setShowSearchHints: Dispatch<SetStateAction<boolean>>;
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
}

export interface IEditionPageAppOptionMutators {
  disableMaxWidth: () => void | Promise<void>;
  enableMaxWidth: () => void | Promise<void>;
}

export interface ILayoutData {
  size: EditionFontSize;
  font: EditionFontFamily;
  canvas: fabric.Canvas | null;
}

export interface ILayoutOptionsMethods {
  setSize: Dispatch<SetStateAction<EditionFontSize>>;
  setFont: Dispatch<SetStateAction<EditionFontFamily>>;
  setCanvas: Dispatch<SetStateAction<fabric.Canvas | null>>;
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
  ) => Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }>;
  fetchEditionUpdateByPage?: (
    editionId: string,
    manuscriptId: string,
    pageNumber: number
  ) => Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }>;
  fetchBookUnits?: (params: {
    Id: string;
  }) => Promise<{ Id: string; Units: IEditionBookUnit[] }>;
}

export type RowVirtualizer = {
  virtualItems: VirtualItem[];
  totalSize: number;
  scrollToOffset: (
    index: number,
    options?: { align: 'start' | 'center' | 'end' | 'auto' } | undefined
  ) => void;
  scrollToIndex: (
    index: number,
    options?: { align: 'start' | 'center' | 'end' | 'auto' } | undefined
  ) => void;
  measure: () => void;
};

export type MapPosition = 'left' | 'left-XL' | 'bottom';
