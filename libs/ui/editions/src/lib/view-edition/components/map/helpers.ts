import { StackProps } from '@mui/material/Stack/Stack';
import { CSSProperties } from 'react';
import { MotionProps } from 'framer-motion';
import { MapPosition } from '../../models';


export const getMapContainerProps = (state: MapPosition): StackProps => {
  switch (state) {
    case 'left':
      return {
        width: '31%',
        direction: 'column',
        bgcolor: 'white',
        height: 'calc(100vh - 50px)',
        alignItems: 'flex-start',
      };
    case 'left-XL':
      return {
        width: '31%',
        direction: 'column',
        bgcolor: 'white',
        height: 'calc(100vh - 50px)',
        alignItems: 'flex-start',
        sx: {
          overflowY: 'scroll',
          overflowX: 'hidden',
        },
      };
    case 'bottom':
      return {
        width: '100%',
        direction: 'row',
        bgcolor: 'white',
        height: '31vh',
        alignItems: 'flex-end',
      };
  }
  return {};
};

export const getEditionContainerStyle = (
  state: MapPosition | null
): CSSProperties => {
  switch (state) {
    case 'bottom':
      return {
        maxWidth: '100%',
        height: 'calc(69vh - 50px)',
        overflow: 'auto',
      };
    case 'left':
    case 'left-XL':
      return {
        maxWidth: '69%',
        height: 'calc(100vh - 50px)',
        overflow: 'auto',
      };
    case null:
    default:
      return {
        maxWidth: '100%',
        height: 'calc(100vh - 50px)',
        overflow: 'auto',
      };
  }
};

export const getUnitPreviewStyle = (
  x: number,
  y: number,
  state: MapPosition
): CSSProperties => {
  switch (state) {
    case 'bottom':
      return {
        bottom: '31vh',
        left: `min(${x}px, 100vw - 450px)`,
      };
    case 'left':
    case 'left-XL':
    default:
      return {
        top: `min(${y}px, 100vh - 50px)`,
        left: '31vw',
      };
  }
};

export const getUnitPreviewMotionProps = (): MotionProps => {
  return {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { duration: 0.5, ease: 'easeIn' },
  };
};
