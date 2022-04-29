import { createContext } from 'react';

export type EditionFontSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type EditionFontFamily = 'n' | 'sh' | 'a' | 'm' | 'ns';

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
  facsimilePreview: boolean;
  setFacsimilePreview: (v: boolean) => void;
  realTimeUpdates: boolean;
  setRealTimeUpdates: (v: boolean) => void;
  structureViz: boolean;
  setStructureViz: (v: boolean) => void;
  setSize: (size: EditionFontSize) => void;
  setFont: (font: EditionFontFamily) => void;
}

export const ViewEditionContext = createContext<IViewEditionContext>({
  size: 's',
  font: 'n',
  facsimilePreview: false,
  setFont: (font: EditionFontFamily) => {},
  setSize: (font: EditionFontSize) => {},
  setFacsimilePreview: (v: boolean) => {},
  realTimeUpdates: false,
  setRealTimeUpdates: (v: boolean) => {},
  structureViz: false,
  setStructureViz: (v: boolean) => {},
});
