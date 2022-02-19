import useMediaQuery from '@mui/material/useMediaQuery';
import { kalilaTheme } from '../constants';

export const useXSmallScreenMediaQuery = () =>
  useMediaQuery(kalilaTheme.breakpoints.down('md'));

export const useSmallScreenMediaQuery = () =>
  useMediaQuery(kalilaTheme.breakpoints.down('lg'));

export const useMediumScreenMediaQuery = () =>
  useMediaQuery(kalilaTheme.breakpoints.down('xl'));

export const useLargeScreenMediaQuery = () =>
  useMediaQuery(kalilaTheme.breakpoints.up('xl'));
