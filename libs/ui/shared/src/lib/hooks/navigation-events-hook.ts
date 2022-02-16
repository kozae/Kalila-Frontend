import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ISignalrDispatchers, ISignalrState } from '../store';
import { IStore, pageAdminPathRegEx } from '@frontend/util';
import { HubConnection } from '@microsoft/signalr';

export function useNavigationEventHandling({
  state: { connection, isConnected },
  dispatchers: { leaveGroup },
}: IStore<ISignalrState, ISignalrDispatchers>) {
  const router = useRouter();

  useEffect(() => {
    const previousRoute = router.pathname;
    const handleRouteChange = (newRoute: string) => {
      // console.log({ previousRoute });
      // console.log(router.pathname);
      // console.log({ newRoute });
      const canLeaveGroup = () =>
        !newRoute.startsWith(previousRoute) && connection && isConnected;

      const canLeavePagesGroup = () =>
        !pageAdminPathRegEx.test(newRoute) && connection && isConnected;

      switch (previousRoute) {
        case '/manuscript-description':
        case '/administration/manuscript-description':
          if (canLeaveGroup()) {
            leaveGroup(
              'ManuscriptDescription',
              connection as HubConnection
            ).then(() => console.log('ManuscriptDescription group left'));
          }
          break;
        case '/administration/categorical-attributes':
          if (canLeaveGroup()) {
            leaveGroup(
              'CategoricalAttribute',
              connection as HubConnection
            ).then(() => console.log('CategoricalAttribute group left'));
          }
          break;
        case '/administration/pages/[manuscript]':
          if (canLeavePagesGroup()) {
            leaveGroup('Page', connection as HubConnection).then(() =>
              console.log('Page group left')
            );
          }
          break;
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.pathname, connection, isConnected]);
}
