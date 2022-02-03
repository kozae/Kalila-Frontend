import {createTheme as fluentUi} from "@fluentui/react";
import {createTheme} from "@mui/material";

export const kalilaThemeFluentUi = fluentUi({
  defaultFontStyle: { fontFamily: '\'Roboto\', sans-serif' , fontWeight: 'regular' },
  palette: {
    themePrimary: '#6b9e1f',
    themeLighterAlt: '#f8fbf3',
    themeLighter: '#e3efd1',
    themeLight: '#cce2ac',
    themeTertiary: '#9fc566',
    themeSecondary: '#7aaa32',
    themeDarkAlt: '#618e1c',
    themeDark: '#527818',
    themeDarker: '#3c5912',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#7c9dbb',
    neutralSecondary: '#5b81a5',
    neutralPrimaryAlt: '#3f6990',
    neutralPrimary: '#001d39',
    neutralDark: '#163e64',
    black: '#092c4e',
    white: '#ffffff',
  }
});

export const mainGreen = '#6b9e1f';
export const secondaryDarkGreen = '#4a6e15';
export const fontBlue = '#001d39'

export const kalilaTheme = createTheme({
  palette: {
    primary: {
      main: mainGreen
    },
    secondary: {
      main: secondaryDarkGreen
    }
  },
  typography: {
    h1: {
      fontSize: "4.5rem",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 700,
      color: fontBlue,
    },
    h2: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "3rem",
      fontWeight: 500,
      color: fontBlue,
    },
    h3: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "2rem",
      fontWeight: 300,
      color: fontBlue,
    },
    h4: {
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 700,
      fontSize: "3rem",
      color: fontBlue,
    },
    h5: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "2rem",
      fontWeight: 700,
      color: fontBlue,
    },
    body1: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.5rem",
      color: fontBlue,
    },
    body2: {
      fontFamily: "'Amiri', serif;",
      fontSize: "1.5rem",
      color: fontBlue,
    },
  },
});
