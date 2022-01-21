import {useRouter} from "next/router";
import {AdministrationCommandBar, useAdminPageStore, withAdminLayout} from "@frontend/ui/administration";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {SignalrStore} from "@frontend/shared-ui";
import {IPagination} from "@frontend/util";
import {Paginator, StringValueHeader} from "@frontend/ui/table";
import styles from './index.module.scss';
import {plainToInstance} from "class-transformer";
import {ManuscriptDescriptionAdmin} from "@frontend/domain";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import {debounce} from 'lodash';


export function MSDAdministration() {
  const router = useRouter();
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);
  const {state, dispatchers} = useAdminPageStore('ManuscriptDescription', router);
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup('ManuscriptDescription', connection)
        .then(() => console.log('ManuscriptDescription group joined'))
    }
  }, [isConnected, connection])

  const {filter, sort} = useMemo(() => {
    const {PageSize, PageNumber, OrderBy, SortDirection, ...rest} = router.query;
    return {filter: rest, sort: {OrderBy, SortDirection}};
  }, [router.query])


  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch()
    }
  }, [update])

  const documents = useMemo<ManuscriptDescriptionAdmin[]>(
    () => state ? plainToInstance(ManuscriptDescriptionAdmin, state.documents) : null,
    [state]
  )


  const handlePaginationChange = useCallback((pagination: IPagination) => {
    return router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        PageSize: pagination.itemsPerPage,
        PageNumber: pagination.currentPage
      }
    })
  }, [router.query])

  const handleSortChange = useCallback(async (sort: { OrderBy?: string, SortDirection?: 'asc' | 'desc' }) => {
    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        OrderBy: sort.OrderBy,
        SortDirection: sort.SortDirection
      }
    })
  }, [router.query])

  const handleFilterChange = useCallback(debounce(async (filter: any) => {
    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...filter,
      }
    })
  }, 1000), [router.query])

  const defaultPagination: IPagination = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };

  const headerComponentParams = {
    activeSort: {...sort},
    activeFilter: {...filter},
    onSort: handleSortChange,
    onFilter: handleFilterChange
  };
  return (
    <>
      <div className={styles['commands']}>
        <AdministrationCommandBar
          enableDelete={selection.length === 1 && Object.keys(filter).length === 0}
          enableEditSelection={selection.length > 0}
          enableEditByFilter={Object.keys(filter).length > 0}/>
        <Paginator pagination={state?.pagination ?? defaultPagination}
                   onPaginationChange={handlePaginationChange}/>
      </div>
      <div className="ag-theme-kalila" style={{height: "fit-content", width: '100%'}}>
        <AgGridReact
          onSelectionChanged={(event) => setSelection(event.api.getSelectedRows())}
          enableCellTextSelection={true}
          reactUi={true}
          domLayout='autoHeight'
          onGridReady={(event) => event.api.sizeColumnsToFit()}
          rowSelection={'multiple'}
          frameworkComponents={{stringValueHeader: StringValueHeader}}
          defaultColDef={{
            resizable: true,
            flex: 1,
            minWidth: 100,
            headerComponentParams: {
              onFilter: () => console.log('filter called'),
            }
          }}
          headerHeight={120}
          rowData={documents ?? []}>
          <AgGridColumn headerComponent={'stringValueHeader'}
                        pinned={'left'}
                        headerComponentParams={headerComponentParams}
                        lockPosition={true}
                        field="Siglum"/>
          <AgGridColumn headerComponent={'stringValueHeader'}
                        headerComponentParams={headerComponentParams}
                        field="Editor"/>
          <AgGridColumn headerComponent={'stringValueHeader'}
                        headerComponentParams={headerComponentParams}
                        field="EditionProgress"/>
        </AgGridReact>
      </div>
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
