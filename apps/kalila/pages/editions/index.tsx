import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";

/* eslint-disable-next-line */
export interface EditionsProps {}

export function Editions(props: EditionsProps) {
  return (
    <div>
      <h1>Welcome to Editions!</h1>
    </div>
  );
}

export default withTransition(Editions);
