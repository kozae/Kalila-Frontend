import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { EditionStore } from '@frontend/ui/editions';

/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {}

export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  useNavbarMessage(['Image Cycle Analysis:', 'Select Tool']);

  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
      <EditionStore />
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
