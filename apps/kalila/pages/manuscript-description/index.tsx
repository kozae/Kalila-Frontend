import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";

/* eslint-disable-next-line */
export interface ManuscriptDescriptionProps {}

export function ManuscriptDescription(props: ManuscriptDescriptionProps) {
  return (
    <div>
      <h1>Welcome to ManuscriptDescription!</h1>
    </div>
  );
}

export default withTransition(ManuscriptDescription);
