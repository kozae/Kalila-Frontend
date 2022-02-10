import { KalilaDocument } from '@frontend/domain';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  IDocumentDetailedViewContext,
  useDocumentDetailedViewContext,
} from './documents-detailed-view.context';
import {
  getSchema,
  usePaginatedDocuments,
  useSignalrUpdates,
} from '@frontend/shared-ui';
import { defaultPagination, MediaTypes } from '@frontend/util';
import {
  columnsDefsFrom,
  Grid,
  resetSelectionOnQueryChange,
  TablePaginator,
} from '@frontend/ui/table';
import { Column } from 'react-table';

export interface IDocumentsDetailedViewProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>;
  headerComponentParams: any;
}

export const DocumentsDetailedViewPage = <T extends KalilaDocument>({
  cls,
  headerComponentParams,
}: IDocumentsDetailedViewProps<T>) => {
  const router = useRouter();
  const { activityName, filter, additionalParams, onPaginationChange } =
    useDocumentDetailedViewContext<T>() as IDocumentDetailedViewContext<T>;
  const { data: schema } = getSchema(activityName);
  const { state, dispatchers, loading } = usePaginatedDocuments<T>(
    activityName,
    router,
    cls,
    MediaTypes.FullDescriptionDocument,
    additionalParams
  );
  const [selection, setSelection] = useState<T[]>([]);
  const clearSelection = () => setSelection([]);
  const columns: ReadonlyArray<Column<T>> = useMemo(
    () => columnsDefsFrom(schema?.content.Fields ?? [], headerComponentParams),
    [schema?.content, headerComponentParams]
  ) as ReadonlyArray<Column<T>>;
  // const gridParams = useGridParams({ state, setSelection }, { columnDefs });

  resetSelectionOnQueryChange(setSelection, router);
  useSignalrUpdates(activityName, dispatchers);
  return (
    <>
      <TablePaginator
        loading={loading}
        pagination={state?.pagination ?? defaultPagination}
        onPaginationChange={onPaginationChange}
      />
      <Grid
        data={state?.documents ?? []}
        columns={columns}
        loading={loading ?? false}
      />
    </>
  );
};
