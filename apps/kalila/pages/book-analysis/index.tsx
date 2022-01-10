import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";

/* eslint-disable-next-line */
export interface BookAnalysisProps {}

export function BookAnalysis(props: BookAnalysisProps) {
  return (
    <div>
      <h1>Welcome to BookAnalysis!</h1>
    </div>
  );
}

export default withTransition(BookAnalysis);

