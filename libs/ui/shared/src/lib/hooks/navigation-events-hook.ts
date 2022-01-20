import {useRouter} from "next/router";
import {useEffect} from "react";
import {ISignalrDispatchers, ISignalrState} from "../stores";
import {IStore} from "@frontend/util";


export function useNavigationEventHandling({
                                             state: {connection, isConnected},
                                             dispatchers: {leaveGroup}
                                           }: IStore<ISignalrState, ISignalrDispatchers>) {
  const router = useRouter()

  useEffect(() => {
    const previousRoute = router.pathname;
    const handleRouteChange = (newRoute: string, {shallow}: { shallow: boolean }) => {
      // console.log({previousRoute})
      // console.log({newRoute})
      // console.log({shallow})
      switch (previousRoute) {
        case  '/manuscript-description':
        case  '/administration/manuscript-description':
          if (!shallow && !newRoute.startsWith(previousRoute) && connection && isConnected) {
            leaveGroup('ManuscriptDescription', connection)
              .then(() => console.log('ManuscriptDescription group left'))
          }
          break
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.pathname, connection, isConnected])
}
