import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

export function useWindowSize() {
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 10);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  return dimensions;
}
