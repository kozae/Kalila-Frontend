import { KalilaDocument } from '@frontend/domain';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  IDocumentDetailedViewContext,
  useDocumentDetailedViewContext,
} from './documents-detailed-view.context';
import { usePaginatedDocuments, useSignalrUpdates } from '@frontend/shared-ui';
import { defaultPagination, MediaTypes } from '@frontend/util';
import {
  columnsDefsFrom,
  Grid,
  resetSelectionOnQueryChange,
  TablePaginator,
  useGridParams,
} from '@frontend/ui/table';

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
  const { state, dispatchers, loading } = usePaginatedDocuments<T>(
    activityName,
    router,
    cls,
    MediaTypes.FullDescriptionDocument,
    {},
    additionalParams
  );
  const [selection, setSelection] = useState<T[]>([]);
  const clearSelection = () => setSelection([]);
  const columnDefs = useMemo(
    () => columnsDefsFrom(state?.schema?.Fields ?? [], headerComponentParams),
    [state?.schema, headerComponentParams]
  );
  const gridParams = useGridParams({ state, setSelection }, { columnDefs });

  resetSelectionOnQueryChange(setSelection, router);
  useSignalrUpdates(activityName, dispatchers);
  return (
    <>
      <TablePaginator
        loading={loading}
        pagination={state?.pagination ?? defaultPagination}
        onPaginationChange={onPaginationChange}
      />
      <Grid loading={loading ?? false} />
    </>
  );
};
