import './index.module.scss';
import {useNavbarMessage, withTransition} from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface VisualizationsProps {}

export function Visualizations(props: VisualizationsProps) {
  useNavbarMessage(['Visualizations', undefined]);
  return (
    <div>
      <h1>Welcome to Visualizations!</h1>
    </div>
  );
}

export default withTransition(Visualizations, {});
