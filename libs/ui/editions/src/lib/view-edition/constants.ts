import { EditionFontFamily, EditionFontSize } from './models';

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

export const LINE_HEIGHTS: { [key in EditionFontSize]: string } = {
  xs: '1.6rem',
  s: '2.6rem',
  m: '3rem',
  l: '3.2rem',
  xl: '4rem',
};
export const FONT_FAMILIES: { [key in EditionFontFamily]: string } = {
  n: "'Noto Naskh Arabic', serif",
  sh: "'Scheherazade New', serif",
  a: "'Amiri', serif",
  m: "'Mirza', cursive",
  ns: "'Noto Sans Arabic', sans-serif",
};
