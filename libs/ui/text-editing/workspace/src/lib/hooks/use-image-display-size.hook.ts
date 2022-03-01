import {
  selectImageHeight,
  selectImageWidth,
  setImageDimensions,
  useAppDispatch,
  useAppSelector,
  useWindowSize,
} from '@frontend/shared-ui';
import { useEffect } from 'react';

export function useImageDisplaySize(
  widthPercentage = 45,
  navBarHeight = 110,
  margin = 5
) {
  const windowSize = useWindowSize();
  const imageWidth = useAppSelector(selectImageWidth);
  const imageHeight = useAppSelector(selectImageHeight);
  const dispatch = useAppDispatch();
  useEffect(() => {
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

    dispatch(
      setImageDimensions({
        imageDisplayHeight: height,
        imageDisplayWidth: width,
        scaleRatio,
      })
    );
  }, [windowSize, imageWidth, imageHeight]);
}
