import {IRealTimeUpdate, useKalilaSession} from "@frontend/shared-ui";
import {fetcher, IPagination, IStore, MediaTypes} from "@frontend/util";
import {NextRouter} from "next/router";

import {IAdministrationDispatchers, IAdministrationState} from "./models";
import useSWR from "swr";

function useSessionState() {
  const {session, accessToken} = useKalilaSession();
  return {loggedUser: session?.user?.name, accessToken}
}

export function useAdminPageStore(
  activityName: string,
  router: NextRouter,
  update: IRealTimeUpdate
): IStore<IAdministrationState, IAdministrationDispatchers> {
  const {loggedUser, accessToken} = useSessionState();
  const {data, error} = useSWR([activityName, accessToken, router.query, MediaTypes.AdminDocument], fetcher)
  const documents = data?.content ?? {};
  const pagination = data?.pagination as IPagination ?? {};

  return {
    state: {
      documents,
      pagination,
      loggedUser,
      editors: [
        {
          username: 'mk',
          name: 'Mahmoud Kozae'
        },
        {
          username: 'ds',
          name: 'Dima Sakran'
        }
      ]
    },
    dispatchers: {}
  };
}
