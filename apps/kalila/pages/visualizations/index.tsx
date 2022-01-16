import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";

/* eslint-disable-next-line */
export interface VisualizationsProps {}

export function Visualizations(props: VisualizationsProps) {
  return (
    <div>
      <h1>Welcome to Visualizations!</h1>
    </div>
  );
}

export default withTransition(Visualizations, {});

