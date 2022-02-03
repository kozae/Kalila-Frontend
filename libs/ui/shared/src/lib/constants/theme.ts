import {createTheme} from "@mui/material";

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
    button: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1rem",
      fontWeight: 500,
      color: fontBlue,
      textTransform: 'none'
    }
  },
});
