import { useRouter } from 'next/router';
import {
  useBoolean,
  usePagedDocumentsDispatch,
  usePagedDocumentsState,
  usePagedDocumentsStore,
  useSignalrUpdates,
  useSmallScreenMediaQuery,
} from '@frontend/shared-ui';
import { KalilaValueTypes, MediaTypes } from '@frontend/util';
import {
  EditorCell,
  GenericCell,
  getSelectionColumn,
  Grid,
  KeyValueCell,
  PrimaryGreenHeader,
  TablePaginator,
  WhiteHeader,
} from '@frontend/ui/table';
import { Column } from 'react-table';
import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { plainToInstance } from 'class-transformer';
import { PageTranscriptionSummary } from '@frontend/domain';

export interface IPagesSummaryPage {
  manuscript: string;
}

export function PagesSummaryPage({ manuscript }: IPagesSummaryPage) {
  const router = useRouter();
  const isSmallScreen = useSmallScreenMediaQuery();

  const mutator = usePagedDocumentsStore(
    'PageTranscription',
    router.query,
    MediaTypes.FullDescriptionDocument,
    { ManuscriptId: manuscript },
    '/Summary'
  );
  const { loading, documents, pagination, selection, filter } =
    usePagedDocumentsState(PageTranscriptionSummary);
  const dispatchers = usePagedDocumentsDispatch();

  const columns: ReadonlyArray<Column<PageTranscriptionSummary>> = useMemo(
    () => [
      getSelectionColumn<PageTranscriptionSummary>(),
      {
        Header: PrimaryGreenHeader,
        accessor: 'Number',
        f: {
          FieldNamePascalCase: 'Number',
          FieldDisplay: 'Number',
          KalilaValueType: KalilaValueTypes.Int,
        },
        Cell: KeyValueCell,
      },
      {
        Header: PrimaryGreenHeader,
        accessor: 'Editor',
        f: {
          FieldNamePascalCase: 'Editor',
          FieldDisplay: 'Editor',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: EditorCell,
      },
      {
        Header: WhiteHeader,
        accessor: 'EditionProgress',
        f: {
          FieldNamePascalCase: 'EditionProgress',
          FieldDisplay: 'EditionProgress',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: GenericCell,
      },
    ],
    []
  );

  useSignalrUpdates(mutator, 'Page');
  return (
    <>
      <Stack
        sx={{ width: '100%' }}
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
      >
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
            : Array.from({ length: 10 }, () =>
                plainToInstance(PageTranscriptionSummary, {})
              )
        }
        columns={columns}
        loading={loading ?? false}
        categoricalAttributes={{}}
      />
    </>
  );
}

export default PagesSummaryPage;
