import './index.module.scss';
import {
  SignalrStore,
  useNavbarMessage,
  usePaginatedDocuments,
  withTransition,
} from '@frontend/shared-ui';
import { useContext, useEffect } from 'react';
import { MediaTypes } from '@frontend/util';
import { useRouter } from 'next/router';
import { ManuscriptDescription } from '@frontend/domain';

/* eslint-disable-next-line */
export interface ManuscriptDescriptionProps {}

export function ManuscriptDescriptionPage(props: ManuscriptDescriptionProps) {
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

  const router = useRouter();
  const { state, dispatchers, loading } =
    usePaginatedDocuments<ManuscriptDescription>(
      'ManuscriptDescription',
      router,
      ManuscriptDescription,
      MediaTypes.FullDescriptionDocument
    );

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div>
      <h1>Welcome to ManuscriptDescription!</h1>
    </div>
  );
}

export default withTransition(ManuscriptDescriptionPage, {});
