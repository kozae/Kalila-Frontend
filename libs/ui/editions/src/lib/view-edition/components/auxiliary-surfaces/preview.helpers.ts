import { MotionProps } from 'framer-motion';
import { CSSProperties } from 'react';

export function getVerticalFloaterStyle(
  { y }: { y: number },
  isXLScreen: boolean,
  isSmallScreen: boolean,
  height = '200px',
  minY = 300
): CSSProperties {
  const common = {
    position: 'fixed',
    right: isSmallScreen ? 0 : '25%',
    zIndex: 90,
    width: isSmallScreen ? '100%' : isXLScreen ? '800px' : '70%',
    height: isSmallScreen ? '100px' : height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  } as CSSProperties;
  return y > minY
    ? { ...common, top: 10 }
    : ({ ...common, bottom: 10 } as CSSProperties);
}

export const getVerticalFloaterMotionProps = (
  {
    y,
  }: {
    y: number;
  },
  minY = 300
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

export function getHorizontalFloaterStyle(
  { x }: { x: number },
  minX = 300
): CSSProperties {
  const common = {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 90,
    width: '49vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  } as CSSProperties;
  return x > minX
    ? { ...common, left: 0 }
    : ({ ...common, right: 0 } as CSSProperties);
}

export const getHorizontalFloaterMotionProps = (
  {
    x,
  }: {
    x: number;
  },
  minX = 300
): MotionProps => {
  if (x <= minX) {
    return {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
      transition: { duration: 0.5, ease: 'easeIn' },
    };
  }

  return {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5, ease: 'easeIn' },
  };
};
