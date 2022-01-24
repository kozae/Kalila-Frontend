import {IRealTimeUpdate} from "@frontend/shared-ui";
import {useEffect} from "react";

export function useSignalRUpdateProcessing<TDispatchers extends {processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void>}>(update?: IRealTimeUpdate, dispatchers?: TDispatchers) {
  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch()
    }
  }, [update])
}
