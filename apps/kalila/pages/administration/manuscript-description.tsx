import {useRouter} from "next/router";
import {AdministrationCommandBar, useAdminPageStore, withAdminLayout} from "@frontend/ui/administration";
import React, {CSSProperties, useContext, useEffect, useMemo, useState} from "react";
import {SignalrStore} from "@frontend/shared-ui";
import {IPagination} from "@frontend/util";
import {Table} from "@frontend/ui/table";
import {Paginator} from "@frontend/ui/table";
import styles from './index.module.scss';
import {plainToInstance} from "class-transformer";
import {ManuscriptDescriptionAdmin, withAdministrativeColumns} from "@frontend/domain";
import {Column} from "react-table";
import {AgGridColumn, AgGridReact} from "ag-grid-react";


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

  const filter = useMemo(() => {
    const {PageSize, PageNumber, OrderBy, SortDirection, ...rest} = router.query;
    return rest;
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

  const columns = useMemo<Column<ManuscriptDescriptionAdmin>[]>(() =>
      state ? state.schema.Fields.map(f => ({
        Header: f.FieldName,
        accessor: f.FieldNamePascalCase
      } as Column<ManuscriptDescriptionAdmin>)) : null
    , [state]);

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

  const tableStyles: Record<'table' | 'thead', CSSProperties> = {
    table: {
      width: '100%',
      maxHeight: '400px',
      overflow: 'auto'
    },
    thead: {}
  }

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
          rowData={documents ?? []}>
          <AgGridColumn resizable pinned={'left'} lockPosition={true} field="Siglum"/>
          <AgGridColumn resizable field="Editor"/>
          <AgGridColumn resizable field="EditionProgress"/>
          <AgGridColumn resizable field="CreatedAt"/>
          <AgGridColumn resizable field="Version"/>
        </AgGridReact>
      </div>
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
