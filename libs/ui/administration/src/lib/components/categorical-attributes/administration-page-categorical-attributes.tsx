import * as React from 'react';
import {
  GenericCell,
  getSelectionColumn,
  Grid,
  KeyValueCell,
  PrimaryGreenHeader,
  TablePaginator,
  WhiteHeader,
} from '@frontend/ui/table';
import { useRouter } from 'next/router';
import {
  AdministrationCommandBar,
  DeleteDocumentModal,
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import {
  fetchSchema,
  NotificationBar,
  useNotificationBar,
  usePagedDocumentsDispatch,
  usePagedDocumentsState,
  usePagedDocumentsStore,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import { CategoricalAttribute } from '@frontend/domain';
import {
  useControls,
  useCreateHandler,
  useDeleteHandler,
  useUpdateHandler,
} from '../shared/admin-page.hooks';
import { useMemo } from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';
import Stack from '@mui/material/Stack';
import {
  ActivitySchema,
  IDataEntrySchema,
  defaultPagination,
  InputModes,
  KalilaValueTypes,
  MediaTypes,
} from '@frontend/util';
import { CreateAttributeModal } from './modals';
import { EditAttributeModal } from './modals/edit-attribute-modal';
import { Column } from 'react-table';
import { plainToClass } from 'class-transformer';

export const AdministrationPageCategoricalAttributes: React.FC = () => {
  const router = useRouter();
  const { activityName, additionalParams } =
    useAdminPageContext<CategoricalAttribute>() as IAdminPageContext<CategoricalAttribute>;
  const { data: schemaData } = fetchSchema(activityName, { KeyField: true });
  const mutator = usePagedDocumentsStore(
    activityName,
    router.query,
    MediaTypes.AdminDocument,
    additionalParams
  );
  const { loading, documents, pagination, selection, filter } =
    usePagedDocumentsState(CategoricalAttribute);
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

  const { message, messageBarType, isMessageVisible, hideMessage, notifyUser } =
    useNotificationBar();

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

  const selectedDocs = useMemo<CategoricalAttribute[]>(
    () => documents.filter((d) => selection.includes(d.Id as string)),
    [selection, documents.length]
  );
  const handleCreate = useCreateHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideCreateModal
  );
  const handleUpdate = useUpdateHandler(
    selection,
    selectedDocs[0], // old value
    filter,
    additionalParams,
    'one',
    notifyUser,
    dispatchers,
    hideEditModal,
    'updateOne'
  );
  const handleDelete = useDeleteHandler(
    additionalParams,
    notifyUser,
    dispatchers,
    hideDeleteModal
  );
  const columns: ReadonlyArray<Column<CategoricalAttribute>> = React.useMemo(
    () => [
      getSelectionColumn<CategoricalAttribute>('single'),
      {
        Header: PrimaryGreenHeader,
        accessor: 'EntityName',
        f: {
          FieldNamePascalCase: 'EntityName',
          FieldDisplay: 'EntityName',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: KeyValueCell,
      },
      {
        Header: PrimaryGreenHeader,
        accessor: 'FieldName',
        f: {
          FieldNamePascalCase: 'FieldName',
          FieldDisplay: 'FieldName',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: KeyValueCell,
      },
      {
        Header: WhiteHeader,
        accessor: 'Option',
        f: {
          FieldNamePascalCase: 'Option',
          FieldDisplay: 'Option',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: GenericCell,
      },
    ],
    []
  );

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
            {...{
              cls: CategoricalAttribute,
              editByFilter: false,
              filter,
              selection,
              onCreate,
              onEdit,
              onDelete,
            }}
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
            : Array.from({ length: 10 }, () =>
                plainToClass(CategoricalAttribute, {})
              )
        }
        height={'calc(100vh - 235px)'}
        columns={columns}
        loading={loading ?? false}
      />
      {schema ? (
        <>
          <CreateAttributeModal
            isOpen={isCreateModalOpen}
            schema={schema as ActivitySchema}
            onDismiss={() => hideCreateModal()}
            onSubmit={handleCreate}
          />
          <EditAttributeModal
            initialValues={selectedDocs[0] ?? new CategoricalAttribute()}
            isOpen={isEditModalOpen}
            optionFieldSchema={
              schema.Fields.find(
                (f: any) => f.FieldNamePascalCase === 'Option'
              ) as IDataEntrySchema
            }
            onDismiss={() => hideEditModal()}
            onSubmit={handleUpdate}
          />
          <DeleteDocumentModal
            isOpen={isDeleteModalOpen}
            onDismiss={() => hideDeleteModal()}
            doc={selectedDocs[0]}
            onConfirm={handleDelete}
          />
        </>
      ) : null}
    </>
  );
};
