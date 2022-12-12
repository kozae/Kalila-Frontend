import { FramerSlideUpDown } from '@frontend/shared-ui';
import React from 'react';

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
