import React from 'react';
import { FramerSlideUpDown } from '../framer-animations';

export const withTransition = (
  OriginalComponent: React.JSXElementConstructor<any>,
  extraProps: any,
  className: string | undefined = undefined
) => {
  return (props: any) => {
    const merge = { ...props, ...extraProps };
    return (
      <FramerSlideUpDown className={className}>
        <OriginalComponent {...merge} />
      </FramerSlideUpDown>
    );
  };
};
