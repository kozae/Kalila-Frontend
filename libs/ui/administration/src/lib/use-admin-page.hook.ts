import {useAdminPageStore} from "./store";
import {useEffect, useMemo, useState} from "react";
import {plainToInstance} from "class-transformer";
import {useRouter} from "next/router";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {subscribeToSignalrUpdates, useParamsFromRouteQuery} from "@frontend/shared-ui";


export function useAdminPage<T extends object>(activityName: string, cls: ClassConstructor<T>) {
  const router = useRouter();
  const update = subscribeToSignalrUpdates(activityName)
  const {state, dispatchers} = useAdminPageStore(activityName, router);
  const documents = useMemo(() => state ? plainToInstance(cls, state.documents) : null, [state])
  const pagination = useMemo(() => state?.pagination, [state])
  const [selection, setSelection] = useState<string[]>([]);


  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch()
    }
  }, [update])

  useEffect(() => {
    setSelection([])
  }, [router.query])

  return {
    documents,
    pagination,
    selection,
    setSelection,
    ...useParamsFromRouteQuery(router)
  }
}
