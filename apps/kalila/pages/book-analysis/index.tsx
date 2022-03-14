import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface BookAnalysisProps {}

export function BookAnalysis(props: BookAnalysisProps) {
  useNavbarMessage(['Book Analysis:', 'Select Tool']);
  return (
    <div>
      <h1>Welcome to BookAnalysis!</h1>
    </div>
  );
}

export default withTransition(BookAnalysis, {});
