import {
  selectImageHeight,
  selectImageWidth,
  useAppSelector,
  useWindowSize,
} from '@frontend/shared-ui';
import { useMemo } from 'react';

export function useImageContainerSize(
  widthPercentage = 45,
  navBarHeight = 110,
  margin = 5
) {
  const windowSize = useWindowSize();
  const imageWidth = useAppSelector(selectImageWidth);
  const imageHeight = useAppSelector(selectImageHeight);
  return useMemo(() => {
    const maxHeight = windowSize.height - navBarHeight - 2 * margin;
    const maxWidth = (Math.min(windowSize.width, 1600) * widthPercentage) / 100;
    let scaleRatio = 1,
      height = imageHeight,
      width = imageWidth;
    if (imageHeight > maxHeight || imageWidth > maxWidth) {
      scaleRatio = maxHeight / imageHeight;
      height = maxHeight;
      width = imageWidth * scaleRatio;
      if (width > maxWidth) {
        scaleRatio = maxWidth / imageWidth;
        width = maxWidth;
        height = (imageHeight * width) / imageWidth;
      }
    }

    return {
      height,
      width,
      scaleRatio,
      imageHeight,
      imageWidth,
    };
  }, [windowSize, imageWidth, imageHeight]);
}
