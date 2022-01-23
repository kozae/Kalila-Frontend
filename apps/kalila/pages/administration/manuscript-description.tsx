import {AdministrationCommandBar, useAdminPage, withAdminLayout} from "@frontend/ui/administration";
import React from "react";
import {defaultPagination} from "@frontend/util";
import {Paginator, StringValueHeader} from "@frontend/ui/table";
import styles from './index.module.scss';
import {ManuscriptDescriptionAdmin} from "@frontend/domain";
import {AgGridColumn, AgGridReact} from "ag-grid-react";


export function MSDAdministration() {

  const {
    documents,
    pagination,
    filter,
    sort,
    selection,
    setSelection,
    handlePaginationChange,
    handleSortChange,
    handleFilterChange
  } = useAdminPage<ManuscriptDescriptionAdmin>('ManuscriptDescription', ManuscriptDescriptionAdmin)


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
        <Paginator pagination={pagination ?? defaultPagination}
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
          }}
          headerHeight={90}
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
