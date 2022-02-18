import { useCallback } from 'react';
import { KalilaDocument } from '@frontend/domain';
import { IPagedDocumentsDispatch, useBoolean } from '@frontend/shared-ui';

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
  selection: string[],
  oldValue: T,
  filter: Record<string, any>,
  additionalParams: any,
  editMode: 'one' | 'many' | 'filtered',
  notifyUser: (text: string, type: string) => void,
  dispatchers: IPagedDocumentsDispatch,
  hideEditModal: () => void,
  handler: 'admin' | 'updateOne' = 'admin'
) {
  return useCallback(
    async (doc: T) => {
      const update = await doc.CreateAdminUpdate(oldValue, editMode);
      let params;
      try {
        switch (handler) {
          case 'admin':
            params = editMode === 'filtered' ? filter : { Ids: selection };
            await dispatchers
              .adminUpdateDocuments({
                update,
                params: {
                  ...params,
                  ...additionalParams,
                },
              })
              .unwrap();

            break;
          case 'updateOne':
            params = { Id: selection[0] };
            await dispatchers
              .updateOneDocument({
                update,
                params: {
                  ...params,
                  ...additionalParams,
                },
              })
              .unwrap();

            break;
        }

        notifyUser('updated successfully', 'success');
      } catch {
        notifyUser('could not update', 'error');
      } finally {
        hideEditModal();
        dispatchers.clearSelection();
      }
    },
    [editMode, selection, dispatchers, filter]
  );
}

export function useDeleteHandler<T extends KalilaDocument>(
  additionalParams: any,
  notifyUser: (text: string, type: string) => void,
  dispatchers: IPagedDocumentsDispatch,
  hideDeleteModal: () => void
) {
  return useCallback(
    async (doc: T) => {
      try {
        await dispatchers
          .deleteDocument({
            id: doc.Id as string,
            additionalParams,
          })
          .unwrap();
        notifyUser('deleted successfully', 'success');
      } catch {
        notifyUser('could not delete', 'error');
      } finally {
        hideDeleteModal();
        dispatchers.clearSelection();
      }
    },
    [dispatchers]
  );
}

export function useCreateHandler<T extends KalilaDocument>(
  additionalParams: any,
  notifyUser: (text: string, type: string) => void,
  dispatchers: IPagedDocumentsDispatch,
  hideCreateModal: () => void
) {
  return useCallback(
    async (doc: T) => {
      try {
        await dispatchers
          .createDocument({ ...doc, ...additionalParams })
          .unwrap();
        notifyUser('created successfully', 'success');
      } catch {
        notifyUser('could not create', 'error');
      } finally {
        hideCreateModal();
        dispatchers.clearSelection();
      }
    },
    [dispatchers]
  );
}
