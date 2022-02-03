import React from "react";
import useMediaQuery from '@mui/material/useMediaQuery';

export interface IKalilaMediaQuery {
  s?: boolean,
  m?: boolean,
  l?: boolean,
  isSmallScreen?: boolean,
  xl?: boolean,
  xxl?: boolean,
  isNotXXLScreen?: boolean,
  xxxl?: boolean
}

export function useKalilaMediaQuery(): IKalilaMediaQuery {
  return {
    s: useMediaQuery('(max-width: 479px)'),
    m: useMediaQuery('(min-width: 480px) and (max-width: 639px)'),
    l: useMediaQuery('(min-width: 640px) and (max-width: 1023px)'),
    isSmallScreen:  useMediaQuery('(max-width: 1023px)'),
    xl: useMediaQuery('(min-width: 1024px) and (max-width: 1365px)'),
    isNotXXLScreen:  useMediaQuery('(max-width: 1365px)'),
    xxl: useMediaQuery('(min-width: 1366px) and (max-width: 1919px)'),
    xxxl: useMediaQuery('(min-width: 1920px)'),
  };
}


export const MediaQueryWrapper = React.createContext<IKalilaMediaQuery>({});
