import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { NextRouter } from 'next/router';

import {
  AgGridReactProps,
  AgReactUiProps,
} from 'ag-grid-react/lib/shared/interfaces';
import { KalilaDocument } from '@frontend/domain';
import {
  IPaginatedDocumentsDispatchers,
  useBoolean,
} from '@frontend/shared-ui';

export function useControls() {
  const [
    isCreateModalOpen,
    { setTrue: showCreateModal, setFalse: hideCreateModal },
  ] = useBoolean(false);
  const [isEditModalOpen, { setTrue: showEditModal, setFalse: hideEditModal }] =
    useBoolean(false);
  const [
    isDeleteModalOpen,
    { setTrue: showDeleteModal, setFalse: hideDeleteModal },
  ] = useBoolean(false);

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
    hideDeleteModal,
  };
}

export function useUpdateHandler<T extends KalilaDocument>(
  selection: T[],
  filter: Record<string, any>,
  additionalParams: any,
  editMode: 'one' | 'many' | 'filtered',
  notifyUser: (text: string, type: string) => void,
  dispatchers: IPaginatedDocumentsDispatchers<T> | undefined,
  hideEditModal: () => void,
  clearSelection: () => void,
  handler: 'admin' | 'updateOne' = 'admin'
) {
  return useCallback(
    async (doc: T) => {
      const update = await doc.CreateAdminUpdate(selection[0], editMode);
      let params;
      try {
        switch (handler) {
          case 'admin':
            params =
              editMode === 'filtered'
                ? filter
                : { Ids: selection.map((d) => d.Id) };
            if (dispatchers?.adminUpdateDocument) {
              await dispatchers.adminUpdateDocument(update, {
                ...params,
                ...additionalParams,
              });
            }
            break;
          case 'updateOne':
            if (dispatchers?.updateOneDocument) {
              params = { Id: selection[0].Id };
              await dispatchers.updateOneDocument(update, {
                ...params,
                ...additionalParams,
              });
            }
            break;
        }

        notifyUser('updated successfully', 'success');
      } catch {
        notifyUser('could not update', 'error');
      } finally {
        hideEditModal();
        clearSelection();
      }
    },
    [editMode, selection, dispatchers, filter]
  );
}

export function useDeleteHandler<T extends KalilaDocument>(
  additionalParams: any,
  notifyUser: (text: string, type: string) => void,
  dispatchers: IPaginatedDocumentsDispatchers<T> | undefined,
  hideDeleteModal: () => void,
  clearSelection: () => void
) {
  return useCallback(
    async (doc: T) => {
      try {
        if (dispatchers?.deleteDocument) {
          await dispatchers.deleteDocument(doc.Id as string, additionalParams);
        }
        notifyUser('deleted successfully', 'success');
      } catch {
        notifyUser('could not delete', 'error');
      } finally {
        hideDeleteModal();
        clearSelection();
      }
    },
    [dispatchers]
  );
}

export function useCreateHandler<T extends KalilaDocument>(
  additionalParams: any,
  notifyUser: (text: string, type: string) => void,
  dispatchers: IPaginatedDocumentsDispatchers<T> | undefined,
  hideCreateModal: () => void,
  clearSelection: () => void
) {
  return useCallback(
    async (doc: T) => {
      try {
        if (dispatchers?.createDocument) {
          await dispatchers.createDocument({ ...doc, ...additionalParams });
        }
        notifyUser('created successfully', 'success');
      } catch {
        notifyUser('could not create', 'error');
      } finally {
        hideCreateModal();
        clearSelection();
      }
    },
    [dispatchers]
  );
}
