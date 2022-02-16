import { KalilaDocument } from '@frontend/domain';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import {
  IDocumentDetailedViewContext,
  useDocumentDetailedViewContext,
} from './documents-detailed-view.context';
import {
  getSchemaWithClientSideFilter,
  useAppSelector,
  selectPagedDocsLoading,
  useBoolean,
  usePagedDocuments,
  useSignalrUpdates,
  selectPagedDocs, selectPagination
} from "@frontend/shared-ui";
import { defaultPagination, MediaTypes, setAllNull } from '@frontend/util';
import {
  columnsDefsFrom,
  getSelectionColumn,
  Grid,
  resetSelectionOnQueryChange,
  TablePaginator,
  useTableSchema,
} from '@frontend/ui/table';
import { Column } from 'react-table';
import { plainToClass, plainToInstance } from "class-transformer";
import { IFilterProps, ISortControlProps } from '@frontend/ui/table';
import Stack from '@mui/material/Stack';
import { DocumentsDetailedViewControlBar } from './documents-detailed-view-control-bar';
import { ConfigureColumnsModal } from './modals';
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
  const { excludedColumns, excludeColumns, includeColumns, resetColumns } =
    useExcludedColumns(activityName);
  const [
    isConfigureColumnsModalOpen,
    { setTrue: showConfigureColumnsModal, setFalse: hideConfigureColumnsModal },
  ] = useBoolean(false);

  const dispatchers = usePagedDocuments<T>(
    activityName,
    router,
    MediaTypes.FullDescriptionDocument,
    additionalParams
  );
  const loading = useAppSelector(selectPagedDocsLoading);
  const documents = plainToInstance(cls, useAppSelector(selectPagedDocs));
  const pagination = useAppSelector(selectPagination);
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

  const tableSchema = useTableSchema(schema, excludedColumns);

  const columns: ReadonlyArray<Column<T>> = useMemo(() => {
    const defs = columnsDefsFrom(tableSchema);
    if (defs) {
      return [getSelectionColumn<any>(selection, setSelection), ...defs];
    }
    return null;
  }, [tableSchema]) as ReadonlyArray<Column<T>>;

  const clearFilters = useCallback(async () => {
    await headerProps.onFilter(setAllNull({ ...filter }));
  }, [headerProps, filter]);

  resetSelectionOnQueryChange(clearSelection, router);
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
          docCount={pagination.totalItems}
          onClearFilter={clearFilters}
          showConfigureColumnsModal={showConfigureColumnsModal}
        />
        {groupToggle}
        <TablePaginator
          loading={loading}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
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
        headerProps={headerPropsWithAttributes}
      />
      <ConfigureColumnsModal
        isOpen={isConfigureColumnsModalOpen}
        fields={schema?.Fields ?? []}
        onDismiss={hideConfigureColumnsModal}
        excludedColumns={excludedColumns}
        includeColumns={includeColumns}
        excludeColumns={excludeColumns}
        resetColumns={resetColumns}
      />
    </>
  );
};
