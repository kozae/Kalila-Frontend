import React, { useEffect, useMemo, useState } from 'react';
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
  resetSelectionOnQueryChange,
  ISortControlProps,
  IFilterProps,
} from '@frontend/ui/table';
import { defaultPagination, MediaTypes } from '@frontend/util';
import { useRouter } from 'next/router';
import {
  fetchSchema,
  NotificationBar,
  useNotificationBar,
  usePagedDocuments,
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
import { Column } from 'react-table';
import { plainToClass } from 'class-transformer';

export interface IAdministrationPageProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>; // just for type inference
  columns: ReadonlyArray<Column<T>>;
  gridHeight?: string;
  headerProps: ISortControlProps & IFilterProps;
}

export const AdministrationPage = <T extends KalilaDocument>({
  cls,
  columns,
  gridHeight,
  headerProps,
}: IAdministrationPageProps<T>) => {
  const router = useRouter();
  const {
    activityName,
    initialValues,
    filter,
    additionalParams,
    onPaginationChange,
    selection,
    clearSelection,
  } = useAdminPageContext<T>() as IAdminPageContext<T>;
  const { data: schema } = fetchSchema(activityName, { KeyField: true });
  const { state, dispatchers, loading } = usePagedDocuments<T>(
    activityName,
    router,
    cls,
    MediaTypes.AdminDocument,
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

  const [editMode, setEditMode] = useState<'one' | 'many' | 'filtered'>(
    'filtered'
  );
  const selectedDocs = useMemo<T[]>(() => {
    if (state?.documents) {
      return state.documents.filter((d) => selection.has(d.Id as string));
    }
    return [];
  }, [selection, state?.documents]);

  const { message, messageBarType, isMessageVisible, hideMessage, notifyUser } =
    useNotificationBar();

  const handleUpdate = useUpdateHandler(
    selection,
    selectedDocs[0],
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
      selection.size === 0 ? 'filtered' : selection.size === 1 ? 'one' : 'many'
    );
  }, [selection.size]);

  resetSelectionOnQueryChange(clearSelection, router);
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
      <Grid
        data={
          state?.documents && state.documents.length !== 0
            ? state.documents
            : Array.from({ length: 10 }, () => plainToClass(cls, {}))
        }
        height={gridHeight}
        columns={columns}
        headerProps={headerProps}
        loading={loading ?? false}
      />
      {schema?.content ? (
        <>
          <CreateDocumentModal
            cls={cls}
            isOpen={isCreateModalOpen}
            schema={schema.content}
            onDismiss={() => hideCreateModal()}
            onSubmit={handleCreate}
          />
          <EditDocumentModal
            cls={cls}
            initialValues={editMode === 'one' ? selectedDocs[0] : initialValues}
            editMode={editMode}
            isOpen={isEditModalOpen}
            schema={schema.content}
            onDismiss={() => hideEditModal()}
            onSubmit={handleUpdate}
          />
        </>
      ) : null}
      <DeleteDocumentModal
        isOpen={isDeleteModalOpen}
        onDismiss={() => hideDeleteModal()}
        doc={selectedDocs[0]}
        onConfirm={handleDelete}
      />
    </>
  );
};
