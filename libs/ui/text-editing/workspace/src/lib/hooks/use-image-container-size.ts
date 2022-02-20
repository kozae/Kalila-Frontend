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
    let scaleRatio = 1;
    if (imageHeight <= maxHeight && imageWidth <= maxWidth) {
      return {
        height: imageHeight,
        width: imageWidth,
        scaleRatio,
        imageHeight,
        imageWidth,
      };
    }
    const imageResolution = imageWidth / imageHeight;
    const maxResolution = maxWidth / maxHeight;
    if (maxResolution > imageResolution) {
      scaleRatio = maxHeight / imageHeight;
      return {
        height: maxHeight,
        width: Math.round(imageWidth * scaleRatio),
        scaleRatio,
        imageHeight,
        imageWidth,
      };
    }
    scaleRatio = maxWidth / imageWidth;
    return {
      height: Math.round(imageHeight * scaleRatio),
      width: maxWidth,
      scaleRatio,
      imageHeight,
      imageWidth,
    };
  }, [windowSize, imageWidth, imageHeight]);
}
