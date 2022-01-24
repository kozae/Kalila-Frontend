import React, {useEffect, useState} from "react";
import {AgGridReactProps, AgReactUiProps} from "ag-grid-react/lib/shared/interfaces";
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {StringValueHeader} from "@frontend/ui/table";

export interface IGridProps {
  gridParams: AgGridReactProps | AgReactUiProps,
  loading: boolean
}

function useOverlays(gridApi: GridApi | null, gridParams: AgGridReactProps | AgReactUiProps, loading: boolean) {
  useEffect(() => {
    if (gridApi) {
      if (gridParams.rowData) {
        if (gridParams.rowData.length === 0 && !loading) {
          gridApi.showNoRowsOverlay();
        } else if (loading) {
          gridApi.showLoadingOverlay();
        } else {
          gridApi.hideOverlay()
        }
      }
    }
  }, [gridApi, gridParams.rowData?.length, loading])
}

const loadingOverlays = '<span class="ag-overlay-loading-center">loading...</span>';
const noRowsOverlays = `<span style="padding: 10px; border: 2px solid #444; background: white;">No data</span>`;

export const Grid: React.FC<IGridProps> = (
  {
    children,
    gridParams,
    loading
  }) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const onGridReady = (event: GridReadyEvent) => {
    event.api.sizeColumnsToFit()
    setGridApi(event.api);
  }

  useOverlays(gridApi, gridParams, loading)

  const defaultParams: AgGridReactProps | AgReactUiProps = {
    enableCellTextSelection: true,
    reactUi: true,
    domLayout: 'autoHeight',
    onGridReady: onGridReady,
    overlayLoadingTemplate: loadingOverlays,
    overlayNoRowsTemplate: noRowsOverlays,
    rowSelection: 'multiple',
    frameworkComponents: {stringValueHeader: StringValueHeader},
    defaultColDef: {
      resizable: true,
      flex: 1,
      minWidth: 100,
    },
    headerHeight: 90
  };

  return (
    <div className="ag-theme-kalila" style={{height: "fit-content", width: '100%'}}>
      <AgGridReact {...gridParams} {...defaultParams}>
        {children}
      </AgGridReact>
    </div>
  )
}
