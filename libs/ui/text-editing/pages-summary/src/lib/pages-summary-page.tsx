import { useRouter } from 'next/router';
import {
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
import Button from '@mui/material/Button';

export interface IPagesSummaryPage {
  manuscript: string;
}

export function PagesSummaryPage({ manuscript }: IPagesSummaryPage) {
  const router = useRouter();
  const isSmallScreen = useSmallScreenMediaQuery();

  const mutator = usePagedDocumentsStore(
    'PageTranscription',
    router.query,
    MediaTypes.FolioTranscriptionSummary,
    { ManuscriptId: manuscript },
    '/Summary'
  );
  const { loading, documents, pagination, selection, filter } =
    usePagedDocumentsState(PageTranscriptionSummary);
  const dispatchers = usePagedDocumentsDispatch();

  const columns: ReadonlyArray<Column<PageTranscriptionSummary>> = useMemo(
    () => [
      getSelectionColumn<PageTranscriptionSummary>('single'),
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
        accessor: 'FacsimileImageUrl',
        f: {
          FieldNamePascalCase: 'FacsimileImageUrl',
          FieldDisplay: 'Facsimile',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: GenericCell,
      },
      {
        Header: WhiteHeader,
        accessor: 'NumberOfTextElements',
        f: {
          FieldNamePascalCase: 'NumberOfTextElements',
          FieldDisplay: 'Text Elements',
          KalilaValueType: KalilaValueTypes.Int,
        },
        Cell: GenericCell,
      },
      {
        Header: WhiteHeader,
        accessor: 'NumberOfImageElements',
        f: {
          FieldNamePascalCase: 'NumberOfImageElements',
          FieldDisplay: 'Images',
          KalilaValueType: KalilaValueTypes.Int,
        },
        Cell: GenericCell,
      },
      {
        Header: WhiteHeader,
        accessor: 'NumberOfTokens',
        f: {
          FieldNamePascalCase: 'NumberOfTokens',
          FieldDisplay: 'Transcription',
          KalilaValueType: KalilaValueTypes.Int,
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
        <Button
          disableElevation
          disabled={selection.length !== 1}
          onClick={() =>
            router.push(`/text-editing/${manuscript}/${selection[0]}`)
          }
          variant="contained"
          color="secondary"
        >
          Edit
        </Button>
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
