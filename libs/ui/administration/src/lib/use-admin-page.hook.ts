import {Dispatch, SetStateAction, useEffect,  useState} from "react";
import {NextRouter, useRouter} from "next/router";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {
  subscribeToSignalrUpdates,
  usePaginatedDocuments,
  useParamsFromRouteQuery,
  useRegisteredEditors, useSignalRUpdateProcessing
} from "@frontend/shared-ui";

function resetSelectionOnQueryChange(setter:  Dispatch<SetStateAction<string[]>>, {query}: NextRouter) {
  useEffect(() => {
    setter([])
  }, [query])
}


export function useAdminPage<T extends object>(activityName: string, cls: ClassConstructor<T>) {
  const router = useRouter();
  const update = subscribeToSignalrUpdates(activityName)
  const {state, dispatchers, loading} = usePaginatedDocuments<T>(activityName, router, cls);
  const editors = useRegisteredEditors()
  const [selection, setSelection] = useState<string[]>([]);

  resetSelectionOnQueryChange(setSelection, router);
  useSignalRUpdateProcessing(update, dispatchers);


  if (!loading && state) {
    return {
      ...state,
      loading: false,
      selection,
      editors,
      setSelection,
      ...useParamsFromRouteQuery(router)
    }
  }

  return  {
    documents: null,
    pagination: null,
    loading: true,
    selection,
    editors,
    setSelection,
    ...useParamsFromRouteQuery(router)
  }
}
