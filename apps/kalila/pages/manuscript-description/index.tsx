import './index.module.scss';
import {
  SignalrStore,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import { useContext, useEffect } from 'react';

/* eslint-disable-next-line */
export interface ManuscriptDescriptionProps {}

export function ManuscriptDescription(props: ManuscriptDescriptionProps) {
  const {
    state: { update, connection, isConnected },
    dispatchers: { joinGroup },
  } = useContext(SignalrStore);

  useNavbarMessage(['Manuscript Description:', 'View Documents']);

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup('ManuscriptDescription', connection).then(() =>
        console.log('ManuscriptDescription group joined')
      );
    }
  }, [isConnected, connection]);

  return (
    <div>
      <h1>Welcome to ManuscriptDescription!</h1>
    </div>
  );
}

export default withTransition(ManuscriptDescription, {});
