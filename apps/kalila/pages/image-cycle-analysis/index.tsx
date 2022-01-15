import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";

/* eslint-disable-next-line */
export interface ImageCycleAnalysisProps {
}

export function ImageCycleAnalysis(props: ImageCycleAnalysisProps) {
  return (
    <div>
      <h1>Welcome to ImageCycleAnalysis!</h1>
    </div>
  );
}

export default withTransition(ImageCycleAnalysis, {});
