import './index.module.scss';
import {NavMessageBarContext, withTransition} from '@frontend/shared-ui';
import {useContext} from 'react';

/* eslint-disable-next-line */
export interface AccountProps {}

export function Account(props: AccountProps) {
  const { changeMessage } = useContext(NavMessageBarContext);
  changeMessage(['Account Settings:', undefined]);
  return (
    <div>
      <h1>Welcome to Account!</h1>
    </div>
  );
}

export default withTransition(Account, {});
