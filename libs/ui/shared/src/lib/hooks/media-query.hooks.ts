import useMediaQuery from '@mui/material/useMediaQuery';
import { kalilaTheme } from '../constants';

export const useSmallScreenMediaQuery = () =>
  useMediaQuery(kalilaTheme.breakpoints.down('lg'));

export const useMediumScreenMediaQuery = () =>
  useMediaQuery(kalilaTheme.breakpoints.down('xl'));
