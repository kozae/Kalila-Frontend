import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import React from 'react';
import Head from 'next/head';
import { initGrid } from '@frontend/ui/table';
import {
  CodicologyColumns,
  createDocumentDetailedViewContext,
  DocumentsDetailedViewPage,
} from '@frontend/ui/documents-detailed-view';
import { ManuscriptDescription } from '@frontend/domain';

export function ManuscriptDescriptionPage() {
  useNavbarMessage(['Manuscript Description:', 'View Documents']);
  const { editors, filter, handlePaginationChange, headerComponentParams } =
    initGrid();
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
        }}
      >
        <DocumentsDetailedViewPage
          headerComponentParams={headerComponentParams}
          cls={ManuscriptDescription}
        />
      </DocumentViewContext.Provider>
    </>
  );
}

export default withTransition(ManuscriptDescriptionPage, {});
