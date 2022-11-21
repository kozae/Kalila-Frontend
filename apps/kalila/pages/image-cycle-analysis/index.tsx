import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {}

export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  useNavbarMessage(['Image Cycle Analysis:', 'Select Tool']);
  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
