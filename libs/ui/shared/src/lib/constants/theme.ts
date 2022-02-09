import { createTheme } from '@mui/material';

export const themeColors = {
  mainGreen: '#6b9e1f',
  secondaryDarkBlue: '#001d39',
  fontBlue: '#001d39',
  infoBlue: '#164574',
  warningRed: '#CC0000',
};

export const kalilaTheme = createTheme({
  palette: {
    primary: {
      main: themeColors.mainGreen,
    },
    secondary: {
      main: themeColors.secondaryDarkBlue,
    },
    info: {
      main: themeColors.infoBlue,
    },
    warning: {
      main: themeColors.warningRed,
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontFamily: "'Noto Sans Display', sans-serif",
      fontWeight: 700,
      color: themeColors.fontBlue,
    },
    h2: {
      fontFamily: "'Noto Sans Display', sans-serif",
      fontSize: '1.5rem',
      fontWeight: 500,
      color: themeColors.fontBlue,
    },
    h3: {
      fontFamily: "'Noto Sans Display', sans-serif",
      fontSize: '1.2rem',
      fontWeight: 500,
      color: themeColors.fontBlue,
    },
    h4: {
      fontFamily: "'Noto Sans Display', sans-serif",
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    h5: {
      fontFamily: "'Noto Sans Display', sans-serif",
      fontSize: '1.3rem',
      fontWeight: 400,
    },
    body1: {
      fontFamily: "'Noto Sans Display', sans-serif",
      fontSize: '.85rem',
    },
    body2: {
      fontFamily: "'Noto Naskh Arabic', serif",
      fontSize: '1rem',
      color: themeColors.fontBlue,
    },
    button: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '1rem',
      fontWeight: 300,
      textTransform: 'none',
    },
  },
});
