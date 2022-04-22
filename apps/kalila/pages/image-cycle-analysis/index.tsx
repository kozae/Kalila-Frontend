import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import * as store from 'edition-page-store';
/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {}

export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  useNavbarMessage(['Image Cycle Analysis:', 'Select Tool']);

  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
      <button onClick={() => store.greet('Mahmoud')}>Click me!</button>
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
