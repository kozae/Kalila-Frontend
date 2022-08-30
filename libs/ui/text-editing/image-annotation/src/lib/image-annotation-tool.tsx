import {
  selectAllImageElements,
  selectTextEditingAccessMode,
  useAppSelector,
} from '@frontend/shared-ui';
import { ViewImages } from './view-images';
import { EditImages } from './edit-images';

export const ImageAnnotationTool = () => {
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  const images = useAppSelector(selectAllImageElements);
  return accessMode === 'view' ? (
    <ViewImages data={images} />
  ) : (
    <EditImages data={images} />
  );
};
