import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {NextRouter} from "next/router";

import {useBoolean} from "@fluentui/react-hooks";
import {AgGridReactProps, AgReactUiProps} from "ag-grid-react/lib/shared/interfaces";
import {KalilaDocument} from "@frontend/domain";
import {MessageBarType} from "@fluentui/react";
import {IPaginatedDocumentsDispatchers} from "@frontend/shared-ui";


export function resetSelectionOnQueryChange(setter: Dispatch<SetStateAction<any[]>>, {query}: NextRouter) {
  useEffect(() => {
    setter([])
  }, [query])
}


export function useControls() {
  const [isCreateModalOpen, {setTrue: showCreateModal, setFalse: hideCreateModal}] = useBoolean(false);
  const [isEditModalOpen, {setTrue: showEditModal, setFalse: hideEditModal}] = useBoolean(false);
  const [isDeleteModalOpen, {setTrue: showDeleteModal, setFalse: hideDeleteModal}] = useBoolean(false);


  const onCreate = () => showCreateModal();
  const onEdit = () => showEditModal();
  const onDelete = () => showDeleteModal();

  return {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    onCreate,
    onEdit,
    onDelete,
    hideCreateModal,
    hideEditModal,
    hideDeleteModal
  }
}

export function useGrid({state, setSelection}: any) {
  const gridParams: AgGridReactProps | AgReactUiProps = useMemo(() => ({
    onSelectionChanged: (event) => setSelection(event.api.getSelectedRows()),
    rowData: state?.documents ?? []
  }), [state, setSelection])

  return gridParams
}


export function useUpdateHandler<T extends KalilaDocument>(selection: T[],
                                                    filter: Record<string, any>,
                                                    editMode: 'one' | 'many' | 'filtered',
                                                    notifyUser: (text: string, type: MessageBarType) => void,
                                                    dispatchers: IPaginatedDocumentsDispatchers<T> | undefined,
                                                    hideEditModal: () => void
) {
  return useCallback(async (doc: T) => {
    const update = doc.CreateAdminUpdate(selection[0], editMode);
    const params = editMode === 'filtered' ? filter : {Ids: selection.map(d => d.Id)}
    try {
      if (dispatchers?.updateDocument) {
        await dispatchers.adminUpdateDocument(update, params)
        notifyUser('updated successfully', MessageBarType.info)
      }
    } catch {
      notifyUser('could not update', MessageBarType.error)
    } finally {
      hideEditModal();
    }


  }, [editMode, selection, dispatchers, filter])

}

export function useDeleteHandler<T extends KalilaDocument>(
  notifyUser: (text: string, type: MessageBarType) => void,
  dispatchers: IPaginatedDocumentsDispatchers<T> | undefined,
  hideDeleteModal: () => void) {
  return useCallback(async (doc: T) => {
    try {
      if (dispatchers?.deleteDocument) {
        await dispatchers.deleteDocument(doc.Id as string)
      }
      notifyUser('deleted successfully', MessageBarType.info)
    } catch {
      notifyUser('could not delete', MessageBarType.error)
    } finally {
      hideDeleteModal()
    }
  }, [dispatchers])
}


export function useCreateHandler<T extends KalilaDocument>(
  notifyUser: (text: string, type: MessageBarType) => void,
  dispatchers: IPaginatedDocumentsDispatchers<T> | undefined,
  hideCreateModal: () => void) {
  return useCallback(async (doc: T) => {
    try {
      if (dispatchers?.createDocument) {
        await dispatchers.createDocument(doc)
      }
      notifyUser('created successfully', MessageBarType.info)
    } catch {
      notifyUser('could not create', MessageBarType.error)
    } finally {
      hideCreateModal()
    }
  }, [dispatchers])
}


export function useMessageBar() {
  const [isMessageVisible, {setTrue: showMessage, setFalse: hideMessage}] = useBoolean(false);
  const [message, setMessage] = useState('');
  const [messageBarType, setMessageBarType] = useState(MessageBarType.info);

  const notifyUser = (text: string, type: MessageBarType) => {
    hideMessage();
    setMessage(text);
    setMessageBarType(type);
    showMessage();
  }

  return {message, messageBarType, isMessageVisible, hideMessage, notifyUser}
}
