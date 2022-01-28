import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {NextRouter} from "next/router";

import {useBoolean} from "@fluentui/react-hooks";
import {AgGridReactProps, AgReactUiProps} from "ag-grid-react/lib/shared/interfaces";


export function resetSelectionOnQueryChange(setter: Dispatch<SetStateAction<string[]>>, {query}: NextRouter) {
  useEffect(() => {
    setter([])
  }, [query])
}


export function useControls() {
  const [isCreateModalOpen, {setTrue: showCreateModal, setFalse: hideCreateModal}] = useBoolean(false);
  const [isEditModalOpen, {setTrue: showEditModal, setFalse: hideEditModal}] = useBoolean(false);


  const onCreate = () => showCreateModal();
  const onEdit = () => showEditModal();
  const onDelete = () => console.log('delete')

  return {isCreateModalOpen, isEditModalOpen, onCreate, onEdit, onDelete, hideCreateModal, hideEditModal}
}

export function useGrid({state,setSelection}: any) {
  const gridParams: AgGridReactProps | AgReactUiProps = useMemo(() => ({
    onSelectionChanged: (event) => setSelection(event.api.getSelectedRows()),
    rowData: state?.documents ?? []
  }), [state, setSelection])

  return gridParams
}
