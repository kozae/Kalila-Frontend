import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { initGrid } from '@frontend/ui/table';
import {
  createDocumentDetailedViewContext,
  DocumentsDetailedViewPage,
  useSchemaFilter,
} from '@frontend/ui/documents-detailed-view';
import { ManuscriptDescription } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export function ManuscriptDescriptionPage() {
  useNavbarMessage(['Manuscript Description:', 'View Documents']);
  const { schemaFilter, changeSchemaFilter } = useSchemaFilter();
  const {
    editors,
    filter,
    selection,
    setSelection,
    clearSelection,
    handlePaginationChange,
    headerProps,
  } = initGrid();
  const DocumentViewContext =
    createDocumentDetailedViewContext<ManuscriptDescription>();
  return (
    <>
      <Head>
        <title>Manuscript Description: View Documents</title>
      </Head>
      <DocumentViewContext.Provider
        value={{
          activityName: 'ManuscriptDescription',
          additionalParams: {},
          cls: ManuscriptDescription,
          filter,
          editors,
          onPaginationChange: handlePaginationChange,
          selection,
          setSelection,
          clearSelection,
        }}
      >
        <DocumentsDetailedViewPage
          headerProps={headerProps}
          cls={ManuscriptDescription}
          schemaFilter={schemaFilter}
          groupToggle={
            <Stack direction="row" spacing={0.5}>
              <Button
                onClick={() => changeSchemaFilter({})}
                color="secondary"
                disableElevation
                variant={
                  schemaFilter['FieldGroup'] === undefined
                    ? 'contained'
                    : 'text'
                }
              >
                All
              </Button>
              <Button
                onClick={() => changeSchemaFilter({ FieldGroup: 'Codicology' })}
                color="secondary"
                disableElevation
                variant={
                  schemaFilter['FieldGroup'] === 'Codicology'
                    ? 'contained'
                    : 'text'
                }
              >
                Codicology
              </Button>
              <Button
                onClick={() => changeSchemaFilter({ FieldGroup: 'Version' })}
                color="secondary"
                disableElevation
                variant={
                  schemaFilter['FieldGroup'] === 'Version'
                    ? 'contained'
                    : 'text'
                }
              >
                Version
              </Button>
              <Button
                onClick={() => changeSchemaFilter({ FieldGroup: 'Redaction' })}
                color="secondary"
                disableElevation
                variant={
                  schemaFilter['FieldGroup'] === 'Redaction'
                    ? 'contained'
                    : 'text'
                }
              >
                Redaction
              </Button>
              <Button
                onClick={() => changeSchemaFilter({ FieldGroup: 'Relation' })}
                color="secondary"
                disableElevation
                variant={
                  schemaFilter['FieldGroup'] === 'Relation'
                    ? 'contained'
                    : 'text'
                }
              >
                Relation
              </Button>
            </Stack>
          }
        />
      </DocumentViewContext.Provider>
    </>
  );
}

export default withTransition(ManuscriptDescriptionPage, {});
