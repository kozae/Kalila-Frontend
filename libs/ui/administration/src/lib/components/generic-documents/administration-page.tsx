import React, { useEffect, useState } from 'react';
import {
  AdministrationCommandBar,
  DeleteDocumentModal,
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import {
  Grid,
  TablePaginator,
  useGridParams,
  resetSelectionOnQueryChange,
} from '@frontend/ui/table';
import { defaultPagination, MediaTypes } from '@frontend/util';
import { useRouter } from 'next/router';
import {
  NotificationBar,
  useNotificationBar,
  usePaginatedDocuments,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import {
  useControls,
  useCreateHandler,
  useDeleteHandler,
  useUpdateHandler,
} from '../shared/admin-page.hooks';
import { KalilaDocument } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import { CreateDocumentModal, EditDocumentModal } from './modals';
import { AlertColor } from '@mui/material/Alert/Alert';

export interface IAdministrationPageProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>; // just for type inference
  columns: any[];
}

export const AdministrationPage = <T extends KalilaDocument>({
  cls,
  columns,
}: IAdministrationPageProps<T>) => {
  const router = useRouter();
  const {
    activityName,
    initialValues,
    filter,
    additionalParams,
    onPaginationChange,
  } = useAdminPageContext<T>() as IAdminPageContext<T>;
  const { state, dispatchers, loading } = usePaginatedDocuments<T>(
    activityName,
    router,
    cls,
    MediaTypes.AdminDocument,
    { KeyField: true },
    additionalParams
  );
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    onCreate,
    onEdit,
    onDelete,
    hideCreateModal,
    hideEditModal,
    hideDeleteModal,
  } = useControls();
  const [selection, setSelection] = useState<T[]>([]);
  const clearSelection = () => setSelection([]);
  const [editMode, setEditMode] = useState<'one' | 'many' | 'filtered'>(
    'filtered'
  );
  const { message, messageBarType, isMessageVisible, hideMessage, notifyUser } =
    useNotificationBar();
  const handleUpdate = useUpdateHandler(
    selection,
    filter,
    additionalParams,
    editMode,
    notifyUser,
    dispatchers,
    hideEditModal,
    clearSelection
  );
  const handleDelete = useDeleteHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideDeleteModal,
    clearSelection
  );
  const handleCreate = useCreateHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideCreateModal,
    clearSelection
  );

  useEffect(() => {
    setEditMode(
      selection.length === 0
        ? 'filtered'
        : selection.length === 1
        ? 'one'
        : 'many'
    );
  }, [selection.length]);

  const gridParams = useGridParams(
    { state, setSelection },
    { columnDefs: columns }
  );

  resetSelectionOnQueryChange(setSelection, router);
  useSignalrUpdates(activityName, dispatchers);

  return (
    <>
      <NotificationBar
        {...{
          message,
          messageBarType: messageBarType as AlertColor,
          isMessageVisible,
          hideMessage,
        }}
      />
      {!isMessageVisible ? (
        <Stack direction="row" spacing={1}>
          <AdministrationCommandBar
            {...{ cls, selection, onCreate, onEdit, onDelete }}
          />
          <TablePaginator
            loading={loading}
            pagination={state?.pagination ?? defaultPagination}
            onPaginationChange={onPaginationChange}
          />
        </Stack>
      ) : null}
      <Grid loading={loading ?? false} />
      {state?.schema ? (
        <>
          <CreateDocumentModal
            cls={cls}
            isOpen={isCreateModalOpen}
            schema={state.schema}
            onDismiss={() => hideCreateModal()}
            onSubmit={handleCreate}
          />
          <EditDocumentModal
            cls={cls}
            initialValues={editMode === 'one' ? selection[0] : initialValues}
            editMode={editMode}
            isOpen={isEditModalOpen}
            schema={state.schema}
            onDismiss={() => hideEditModal()}
            onSubmit={handleUpdate}
          />
        </>
      ) : null}
      <DeleteDocumentModal
        isOpen={isDeleteModalOpen}
        onDismiss={() => hideDeleteModal()}
        doc={selection[0]}
        onConfirm={handleDelete}
      />
    </>
  );
};
