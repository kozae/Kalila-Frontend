import {useRouter} from "next/router";
import {AdministrationCommandBar, useAdminPageStore, withAdminLayout} from "@frontend/ui/administration";
import React, {useContext, useEffect} from "react";
import {SignalrStore} from "@frontend/shared-ui";
import {
  Spinner,
  SpinnerSize
} from "@fluentui/react";
import {IPagination} from "@frontend/util";


export function MSDAdministration() {
  const router = useRouter();
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);
  const {state, dispatchers} = useAdminPageStore('ManuscriptDescription', router)

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup('ManuscriptDescription', connection)
        .then(() => console.log('ManuscriptDescription group joined'))
    }
  }, [isConnected, connection])

  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch()
    }
  }, [update])

  const handlePagination = (pagination: IPagination) => {
    return router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        PageSize: pagination.itemsPerPage,
        PageNumber: pagination.currentPage
      }
    })
  }

  const defaultPagination: IPagination = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };

  return (
    <>
      <AdministrationCommandBar
        pagination={state?.pagination ?? defaultPagination}
        handlePagination={handlePagination}/>
      {state?.documents === undefined ? <Spinner size={SpinnerSize.large}/> : null}
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
