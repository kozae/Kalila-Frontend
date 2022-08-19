import { StructurePositions } from './render';
import { StackProps } from '@mui/material/Stack/Stack';
import { CSSProperties } from 'react';
import { MotionProps } from 'framer-motion/types/motion/types';

export const getStructureVizContainerProps = (
  state: StructurePositions,
  showNavbar: boolean
): StackProps => {
  switch (state) {
    case 'left':
      return {
        width: '31%',
        direction: 'column',
        bgcolor: 'white',
        height: showNavbar ? 'calc(100vh - 110px)' : 'calc(100vh - 50px)',
        alignItems: 'flex-start',
      };
    case 'left-XL':
      return {
        width: '31%',
        direction: 'column',
        bgcolor: 'white',
        height: showNavbar ? 'calc(100vh - 110px)' : 'calc(100vh - 50px)',
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
  state: StructurePositions | null,
  showNavbar: boolean
): CSSProperties => {
  switch (state) {
    case 'bottom':
      return {
        maxWidth: '100%',
        height: showNavbar ? 'calc(69vh - 110px)' : 'calc(69vh - 50px)',
        overflow: 'auto',
      };
    case 'left':
    case 'left-XL':
      return {
        maxWidth: '69%',
        height: showNavbar ? 'calc(100vh - 110px)' : 'calc(100vh - 50px)',
        overflow: 'auto',
      };
    case null:
    default:
      return {
        maxWidth: '100%',
        height: showNavbar ? 'calc(100vh - 110px)' : 'calc(100vh - 50px)',
        overflow: 'auto',
      };
  }
};

export const getUnitPreviewStyle = (
  x: number,
  y: number,
  state: StructurePositions
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
