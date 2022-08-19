import { createContext } from 'react';
import { StructurePositions } from './structure/render';

export type EditionFontSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type EditionFontFamily = 'n' | 'sh' | 'a' | 'm' | 'ns';

export interface ILinePreviewData {
  manuscriptSiglum: string;
  manuscriptIdx: number;
  page: number;
  line: number;
}
export const WIDTH_OPTIONS: { [key in EditionFontSize]: number } = {
  xs: 120,
  s: 200,
  m: 300,
  l: 400,
  xl: 500,
};

export const FONT_SIZES: { [key in EditionFontSize]: string } = {
  xs: '0.8rem',
  s: '1.3rem',
  m: '1.5rem',
  l: '1.8rem',
  xl: '2rem',
};
export const FONT_FAMILIES: { [key in EditionFontFamily]: string } = {
  n: "'Noto Naskh Arabic', serif",
  sh: "'Scheherazade New', serif",
  a: "'Amiri', serif",
  m: "'Mirza', cursive",
  ns: "'Noto Sans Arabic', sans-serif",
};

export interface IViewEditionContext {
  size: EditionFontSize;
  font: EditionFontFamily;
  enableFacsimilePreview: boolean;
  setEnableFacsimilePreview: (v: boolean) => void;
  activeLinePreview: ILinePreviewData | null;
  setActiveLinePreview: (v: ILinePreviewData | null) => void;
  realTimeUpdates: boolean;
  setRealTimeUpdates: (v: boolean) => void;
  structureViz: StructurePositions | null;
  setStructureViz: (v: StructurePositions | null) => void;
  setSize: (size: EditionFontSize) => void;
  setFont: (font: EditionFontFamily) => void;
}

export const ViewEditionContext = createContext<IViewEditionContext>({
  size: 's',
  font: 'n',
  enableFacsimilePreview: false,
  setFont: (font: EditionFontFamily) => {},
  setSize: (font: EditionFontSize) => {},
  setEnableFacsimilePreview: (v: boolean) => {},
  activeLinePreview: null,
  setActiveLinePreview: (v: ILinePreviewData | null) => {},
  realTimeUpdates: false,
  setRealTimeUpdates: (v: boolean) => {},
  structureViz: null,
  setStructureViz: (v: StructurePositions | null) => {},
});
