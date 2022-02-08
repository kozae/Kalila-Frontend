import * as React from 'react';
import { Grid, TablePaginator } from '@frontend/ui/table';
import { useRouter } from 'next/router';
import {
  AdministrationCommandBar,
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import {
  NotificationBar,
  useNotificationBar,
  usePaginatedDocuments,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import { CategoricalAttribute } from '@frontend/domain';
import {
  resetSelectionOnQueryChange,
  useControls,
  useGrid,
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
} from '@frontend/util';
import { CreateAttributeModal } from './modals';
import { EditAttributeModal } from './modals/edit-attribute-modal';

export const AdministrationPageCategoricalAttributes: React.FC = ({
  children: columns,
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
  const {
    activityName,
    editors,
    initialValues,
    filter,
    additionalParams,
    onPaginationChange,
  } = useAdminPageContext<CategoricalAttribute>() as IAdminPageContext<CategoricalAttribute>;
  const [selection, setSelection] = useState<CategoricalAttribute[]>([]);
  const clearSelection = () => setSelection([]);
  const { state, dispatchers, loading } =
    usePaginatedDocuments<CategoricalAttribute>(
      activityName,
      router,
      CategoricalAttribute,
      additionalParams
    );
  const gridParams = useGrid(
    { state, setSelection },
    { rowSelection: 'single' }
  );
  const schema = useMemo(() => {
    if (state?.schema) {
      return {
        Fields: state.schema.Fields.map((f) => ({
          ...f,
          InputMode: InputModes.InputOne,
          KalilaValueType: KalilaValueTypes.String,
        })),
      };
    }
    return undefined;
  }, [state?.schema]);
  const handleCreate = (att: CategoricalAttribute) => console.log(att);
  const handleUpdate = (att: CategoricalAttribute) => console.log(att);
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
      <Grid gridParams={gridParams} loading={loading ?? false}>
        {columns}
      </Grid>
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
                (f) => f.FieldNamePascalCase === 'Option'
              ) as DataEntrySchema
            }
            onDismiss={() => hideEditModal()}
            onSubmit={handleUpdate}
          />
        </>
      ) : null}
    </>
  );
};
