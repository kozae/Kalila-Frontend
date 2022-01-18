import {useRouter} from "next/router";
import {AdministrationCommandBar, useAdminPageStore, withAdminLayout} from "@frontend/ui/administration";
import React, {useContext, useEffect, useState} from "react";
import {SignalrStore} from "@frontend/shared-ui";
import {IPagination} from "@frontend/util";
import {Table} from "@frontend/ui/table";


export function MSDAdministration() {
  const router = useRouter();
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);
  const {state, dispatchers} = useAdminPageStore('ManuscriptDescription', router);
  const [selection, setSelection] = useState<string[]>([]);
  const [filter, setFilter] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup('ManuscriptDescription', connection)
        .then(() => console.log('ManuscriptDescription group joined'))
    }
  }, [isConnected, connection])

  useEffect(() => {
    const {PageSize, PageNumber, OrderBy, SortDirection, ...rest} = router.query;
    setFilter(rest);
  }, [router.query])

  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch()
    }
  }, [update])

  const handlePaginationChange = (pagination: IPagination) => {
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
        enableDelete={selection.length === 1 && Object.keys(filter).length === 0}
        enableEditSelection={selection.length > 1}
        enableEditByFilter={Object.keys(filter).length > 0}
        onPaginationChange={handlePaginationChange}/>
      <Table data={state?.documents} schema={state?.schema}/>
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
