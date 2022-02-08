import React, { ReactNode, useEffect, useState } from 'react';
import {
  AdministrationCommandBar,
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { Grid, TablePaginator } from '@frontend/ui/table';
import { defaultPagination } from '@frontend/util';
import { useRouter } from 'next/router';
import {
  NotificationBar,
  useNotificationBar,
  usePaginatedDocuments,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import {
  resetSelectionOnQueryChange,
  useControls,
  useCreateHandler,
  useDeleteHandler,
  useGrid,
  useUpdateHandler,
} from '../shared/admin-page.hooks';
import { KalilaDocument } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import {
  CreateDocumentModal,
  DeleteDocumentModal,
  EditDocumentModal,
} from './modals';
import { AlertColor } from '@mui/material/Alert/Alert';

export interface IAdministrationPageProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>; // just for type inference
  children: ReactNode;
}

export const AdministrationPage = <T extends KalilaDocument>({
  cls,
  children: columns,
}: IAdministrationPageProps<T>) => {
  const router = useRouter();
  const {
    activityName,
    editors,
    initialValues,
    filter,
    additionalParams,
    onPaginationChange,
  } = useAdminPageContext<T>() as IAdminPageContext<T>;
  const { state, dispatchers, loading } = usePaginatedDocuments<T>(
    activityName,
    router,
    cls,
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

  const gridParams = useGrid({ state, setSelection });

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
      <Grid gridParams={gridParams} loading={loading ?? false}>
        {columns}
      </Grid>
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
