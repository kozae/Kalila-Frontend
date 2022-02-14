import { KalilaDocument } from '@frontend/domain';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  IDocumentDetailedViewContext,
  useDocumentDetailedViewContext,
} from './documents-detailed-view.context';
import {
  fetchSchema,
  getSchemaWithClientSideFilter,
  useBoolean,
  usePaginatedDocuments,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import { defaultPagination, MediaTypes, setAllNull } from '@frontend/util';
import {
  columnsDefsFrom,
  Grid,
  resetSelectionOnQueryChange,
  TablePaginator,
  useTableSchema,
} from '@frontend/ui/table';
import { Column } from 'react-table';
import { plainToClass } from 'class-transformer';
import { IFilterProps, ISortControlProps } from '@frontend/ui/table';
import Stack from '@mui/material/Stack';
import { DocumentsDetailedViewControlBar } from './documents-detailed-view-control-bar';
import { ConfigureColumnsModal } from './modals/configure-columns-modal';
import { useExcludedColumns } from './hooks';

export interface IDocumentsDetailedViewProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>;
  headerProps: ISortControlProps & IFilterProps;
  schemaFilter?: any;
  groupToggle?: ReactNode;
}

export const DocumentsDetailedViewPage = <T extends KalilaDocument>({
  cls,
  headerProps,
  schemaFilter,
  groupToggle,
}: IDocumentsDetailedViewProps<T>) => {
  const router = useRouter();
  const {
    activityName,
    filter,
    additionalParams,
    selection,
    setSelection,
    clearSelection,
    onPaginationChange,
  } = useDocumentDetailedViewContext<T>() as IDocumentDetailedViewContext<T>;
  const { excludedColumns, changeExcludedColumns } =
    useExcludedColumns(activityName);
  const [
    isConfigureColumnsModalOpen,
    { setTrue: showConfigureColumnsModal, setFalse: hideConfigureColumnsModal },
  ] = useBoolean(false);

  const { state, dispatchers, loading } = usePaginatedDocuments<T>(
    activityName,
    router,
    cls,
    MediaTypes.FullDescriptionDocument,
    additionalParams
  );
  const schema = getSchemaWithClientSideFilter(
    activityName,
    schemaFilter ?? {}
  );
  const headerPropsWithAttributes = useMemo(() => {
    if (schema) {
      return {
        ...headerProps,
        categoricalAttributes: schema.CategoricalAttributes,
      };
    }
    return headerProps;
  }, [schema, headerProps]);

  const tableSchema = useTableSchema(schema);

  const columns: ReadonlyArray<Column<T>> = useMemo(
    () =>
      columnsDefsFrom(tableSchema, selection, setSelection, excludedColumns),
    [tableSchema, excludedColumns]
  ) as ReadonlyArray<Column<T>>;

  const clearFilters = useCallback(async () => {
    await headerProps.onFilter(setAllNull({ ...filter }));
  }, [headerProps, filter]);

  resetSelectionOnQueryChange(() => {}, router);
  useSignalrUpdates(activityName, dispatchers);
  return (
    <>
      <Stack
        sx={{ width: '100%' }}
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <DocumentsDetailedViewControlBar
          activeFilter={filter}
          selection={selection}
          docCount={state?.pagination ? state.pagination.totalItems : 0}
          onClearFilter={clearFilters}
          showConfigureColumnsModal={showConfigureColumnsModal}
        />
        {groupToggle}
        <TablePaginator
          loading={loading}
          pagination={state?.pagination ?? defaultPagination}
          onPaginationChange={onPaginationChange}
        />
      </Stack>

      <Grid
        data={
          state?.documents && state.documents.length !== 0
            ? state.documents
            : Array.from({ length: 10 }, () => plainToClass(cls, {}))
        }
        columns={columns}
        loading={loading ?? false}
        headerProps={headerPropsWithAttributes}
      />
      <ConfigureColumnsModal
        isOpen={isConfigureColumnsModalOpen}
        fields={schema.Fields ?? []}
        onDismiss={hideConfigureColumnsModal}
        excludedColumns={excludedColumns}
        changeExcludedColumns={changeExcludedColumns}
      />
    </>
  );
};
