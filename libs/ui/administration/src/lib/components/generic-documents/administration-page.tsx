import React, { useEffect, useMemo, useState } from 'react';
import {
  AdministrationCommandBar,
  DeleteDocumentModal,
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { Grid, TablePaginator } from '@frontend/ui/table';
import { MediaTypes } from '@frontend/util';
import { useRouter } from 'next/router';
import {
  fetchSchema,
  NotificationBar,
  useNotificationBar,
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
import {
  usePagedDocumentsDispatch,
  usePagedDocumentsState,
  usePagedDocumentsStore,
} from '@frontend/ui/store';

export interface IAdministrationPageProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>; // just for type inference
  columns: ReadonlyArray<Column<T>>;
  gridHeight?: string;
  excludeFromFilter?: string[];
}

export const AdministrationPage = <T extends KalilaDocument>({
  cls,
  columns,
  gridHeight,
  excludeFromFilter,
}: IAdministrationPageProps<T>) => {
  const router = useRouter();
  const { activityName, initialValues, additionalParams } =
    useAdminPageContext<T>() as IAdminPageContext<T>;
  const { data: schema } = fetchSchema(activityName, { KeyField: true });
  const mutator = usePagedDocumentsStore(
    activityName,
    router.query,
    MediaTypes.AdminDocument,
    additionalParams
  );
  const { loading, documents, pagination, selection, filter } =
    usePagedDocumentsState(cls, excludeFromFilter ?? []);
  const dispatchers = usePagedDocumentsDispatch();
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
  const selectedDocs = useMemo<T[]>(
    () => documents.filter((d) => selection.includes(d.Id as string)),
    [selection, documents.length]
  );

  const { message, messageBarType, isMessageVisible, hideMessage, notifyUser } =
    useNotificationBar();

  const handleUpdate = useUpdateHandler(
    selection,
    selectedDocs[0], // old value
    filter,
    additionalParams,
    editMode,
    notifyUser,
    dispatchers,
    hideEditModal
  );
  const handleDelete = useDeleteHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideDeleteModal
  );
  const handleCreate = useCreateHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideCreateModal
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

  useSignalrUpdates(mutator, activityName);

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
            {...{ cls, selection, filter, onCreate, onEdit, onDelete }}
          />
          <TablePaginator
            loading={loading}
            pagination={pagination}
            onPaginationChange={(pagination) =>
              dispatchers.changePagination(pagination, router)
            }
          />
        </Stack>
      ) : null}
      <Grid
        data={
          documents.length !== 0
            ? documents
            : Array.from({ length: 10 }, () => plainToClass(cls, {}))
        }
        height={gridHeight}
        columns={columns}
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
