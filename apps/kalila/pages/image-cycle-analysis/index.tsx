import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { useEffect } from 'react';
/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {}

export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  useNavbarMessage(['Image Cycle Analysis:', 'Select Tool']);

  useEffect(() => {
    import('edition-page-store').then(({ greet }) => {
      greet('Web');
    });
  }, []);

  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
