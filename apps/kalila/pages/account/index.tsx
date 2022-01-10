import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";

/* eslint-disable-next-line */
export interface AccountProps {}

export function Account(props: AccountProps) {
  return (
    <div>
      <h1>Welcome to Account!</h1>
    </div>
  );
}

export default withTransition(Account);;
