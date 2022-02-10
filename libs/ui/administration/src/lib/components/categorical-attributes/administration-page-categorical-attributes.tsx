import * as React from 'react';
import {
  Grid,
  resetSelectionOnQueryChange,
  TablePaginator,
  useGridParams,
} from '@frontend/ui/table';
import { useRouter } from 'next/router';
import {
  AdministrationCommandBar,
  DeleteDocumentModal,
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import {
  getSchema,
  NotificationBar,
  useNotificationBar,
  usePaginatedDocuments,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import { CategoricalAttribute } from '@frontend/domain';
import {
  useControls,
  useCreateHandler,
  useDeleteHandler,
  useUpdateHandler,
} from '../shared/admin-page.hooks';
import { useEffect, useMemo, useState } from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';
import Stack from '@mui/material/Stack';
import {
  ActivitySchema,
  DataEntrySchema,
  defaultPagination,
  InputModes,
  KalilaValueTypes,
  MediaTypes,
} from '@frontend/util';
import { CreateAttributeModal } from './modals';
import { EditAttributeModal } from './modals/edit-attribute-modal';

export const AdministrationPageCategoricalAttributes: React.FC<any> = ({
  headerComponentParams,
}) => {
  const router = useRouter();
  const { message, messageBarType, isMessageVisible, hideMessage, notifyUser } =
    useNotificationBar();
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
  const { activityName, filter, additionalParams, onPaginationChange } =
    useAdminPageContext<CategoricalAttribute>() as IAdminPageContext<CategoricalAttribute>;
  const [selection, setSelection] = useState<CategoricalAttribute[]>([]);
  const clearSelection = () => setSelection([]);
  const { data: schemaData } = getSchema(activityName, { KeyField: true });
  const { state, dispatchers, loading } =
    usePaginatedDocuments<CategoricalAttribute>(
      activityName,
      router,
      CategoricalAttribute,
      MediaTypes.AdminDocument,
      additionalParams
    );
  const columnDefs: any[] = [
    {
      field: 'EntityName',
      pinned: 'left',
      lockPosition: true,
      headerComponent: 'stringValueHeader',
      headerComponentParams,
    },
    {
      field: 'FieldName',
      headerComponent: 'stringValueHeader',
      headerComponentParams,
    },
    {
      field: 'Option',
      headerComponent: 'stringValueHeader',
      headerComponentParams,
    },
  ];
  const gridParams = useGridParams(
    { state, setSelection },
    { rowSelection: 'single', columnDefs }
  );
  const schema = useMemo(() => {
    if (schemaData?.content) {
      return {
        Fields: schemaData?.content.Fields.map((f: any) => ({
          ...f,
          InputMode: InputModes.InputOne,
          KalilaValueType: KalilaValueTypes.String,
        })),
      };
    }
    return undefined;
  }, [schemaData?.content]);
  const handleCreate = useCreateHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideCreateModal,
    clearSelection
  );
  const handleUpdate = useUpdateHandler(
    selection,
    filter,
    additionalParams,
    'one',
    notifyUser,
    dispatchers,
    hideEditModal,
    clearSelection,
    'updateOne'
  );
  const handleDelete = useDeleteHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideDeleteModal,
    clearSelection
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
            {...{
              cls: CategoricalAttribute,
              editByFilter: false,
              selection,
              onCreate,
              onEdit,
              onDelete,
            }}
          />
          <TablePaginator
            loading={loading}
            pagination={state?.pagination ?? defaultPagination}
            onPaginationChange={onPaginationChange}
          />
        </Stack>
      ) : null}
      {/*<Grid loading={loading ?? false} />*/}
      {schema ? (
        <>
          <CreateAttributeModal
            isOpen={isCreateModalOpen}
            schema={schema as ActivitySchema}
            onDismiss={() => hideCreateModal()}
            onSubmit={handleCreate}
          />
          <EditAttributeModal
            initialValues={selection[0] ?? new CategoricalAttribute()}
            isOpen={isEditModalOpen}
            optionFieldSchema={
              schema.Fields.find(
                (f: any) => f.FieldNamePascalCase === 'Option'
              ) as DataEntrySchema
            }
            onDismiss={() => hideEditModal()}
            onSubmit={handleUpdate}
          />
          <DeleteDocumentModal
            isOpen={isDeleteModalOpen}
            onDismiss={() => hideDeleteModal()}
            doc={selection[0]}
            onConfirm={handleDelete}
          />
        </>
      ) : null}
    </>
  );
};
