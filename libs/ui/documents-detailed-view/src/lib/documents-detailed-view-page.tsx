import { KalilaDocument } from '@frontend/domain';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import React, { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  IDocumentDetailedViewContext,
  useDocumentDetailedViewContext,
} from './documents-detailed-view.context';
import {
  selectAttributes,
  selectFields,
  useAppSelector,
  useBoolean,
  usePagedDocumentsDispatch,
  usePagedDocumentsState,
  usePagedDocumentsStore,
  useSignalrUpdates,
  useSmallScreenMediaQuery,
} from '@frontend/shared-ui';
import { MediaTypes } from '@frontend/util';
import {
  columnsDefsFrom,
  getSelectionColumn,
  Grid,
  TablePaginator,
  useTableSchema,
} from '@frontend/ui/table';
import { Column } from 'react-table';
import { plainToInstance } from 'class-transformer';
import Stack from '@mui/material/Stack';
import { DocumentsDetailedViewActions } from './documents-detailed-view-actions';
import { ConfigureColumnsModal } from './modals';
import { useExcludedColumns } from './hooks';

export interface IDocumentsDetailedViewProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>;
  schemaFilter?: any;
  groupToggle?: ReactNode;
}

export const DocumentsDetailedViewPage = <T extends KalilaDocument>({
  cls,
  schemaFilter,
  groupToggle,
}: IDocumentsDetailedViewProps<T>) => {
  const router = useRouter();
  const isSmallScreen = useSmallScreenMediaQuery();
  const { activityName, additionalParams } =
    useDocumentDetailedViewContext<T>() as IDocumentDetailedViewContext<T>;
  const { excludedColumns, excludeColumns, includeColumns, resetColumns } =
    useExcludedColumns(activityName);
  const [
    isConfigureColumnsModalOpen,
    { setTrue: showConfigureColumnsModal, setFalse: hideConfigureColumnsModal },
  ] = useBoolean(false);

  const mutator = usePagedDocumentsStore(
    activityName,
    router.query,
    MediaTypes.FullDescriptionDocument,
    additionalParams
  );
  const { loading, documents, pagination, selection, filter } =
    usePagedDocumentsState(cls);
  const dispatchers = usePagedDocumentsDispatch();
  const fields = useAppSelector(selectFields(schemaFilter));
  const attributes = useAppSelector(selectAttributes);

  const tableSchema = useTableSchema(fields, excludedColumns);

  const columns: ReadonlyArray<Column<T>> = useMemo(() => {
    const defs = columnsDefsFrom(tableSchema);
    if (defs) {
      return [getSelectionColumn<any>(), ...defs];
    }
    return null;
  }, [tableSchema]) as ReadonlyArray<Column<T>>;

  useSignalrUpdates(mutator, activityName);
  return (
    <>
      <Stack
        sx={{ width: '100%' }}
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <DocumentsDetailedViewActions
          activeFilter={filter}
          selection={selection}
          docCount={pagination.totalItems}
          onClearFilter={() => dispatchers.clearFilter(router)}
          showConfigureColumnsModal={showConfigureColumnsModal}
          view={isSmallScreen ? 'menu' : 'toolbar'}
        />
        {groupToggle}
        <TablePaginator
          loading={loading}
          pagination={pagination}
          onPaginationChange={(pagination) =>
            dispatchers.changePagination(pagination, router)
          }
        />
      </Stack>
      <Grid
        data={
          documents.length !== 0
            ? documents
            : Array.from({ length: 10 }, () => plainToInstance(cls, {}))
        }
        columns={columns}
        loading={loading ?? false}
        categoricalAttributes={attributes}
      />
      <ConfigureColumnsModal
        isOpen={isConfigureColumnsModalOpen}
        fields={fields}
        onDismiss={hideConfigureColumnsModal}
        excludedColumns={excludedColumns}
        includeColumns={includeColumns}
        excludeColumns={excludeColumns}
        resetColumns={resetColumns}
      />
    </>
  );
};
