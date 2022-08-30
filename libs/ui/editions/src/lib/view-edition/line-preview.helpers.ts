import { CSSProperties } from 'react';
import { MotionProps } from 'framer-motion/types/motion/types';

export function getFacsimilePreviewStyle(
  { y }: { y: number },
  isXLScreen: boolean,
  height: string = '200px',
  minY: number = 300
): CSSProperties {
  const common = {
    position: 'fixed',
    right: '25%',
    zIndex: 90,
    width: isXLScreen ? '800px' : '70%',
    height: height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  } as CSSProperties;
  return y > minY
    ? { ...common, top: 10 }
    : ({ ...common, bottom: 10 } as CSSProperties);
}

export const getFacsimilePreviewMotionProps = (
  {
    y,
  }: {
    y: number;
  },
  minY: number = 300
): MotionProps => {
  if (y <= minY) {
    return {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
      transition: { duration: 0.5, ease: 'easeIn' },
    };
  }

  return {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: { duration: 0.5, ease: 'easeIn' },
  };
};
