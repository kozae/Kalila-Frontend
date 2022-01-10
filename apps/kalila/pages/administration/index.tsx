import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";
import {Account} from "../account";

/* eslint-disable-next-line */
export interface AdministrationProps {}

export function Administration(props: AdministrationProps) {
  return (
    <div>
      <h1>Welcome to Administration!</h1>
    </div>
  );
}

export default withTransition(Administration);;
