import './index.module.scss';
import {
  ManuscriptDescriptionGroupToggle,
  useMediumScreenMediaQuery,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import React from 'react';
import Head from 'next/head';
import {
  createDocumentDetailedViewContext,
  DocumentsDetailedViewPage,
  useSchemaFilter,
} from '@frontend/ui/documents-detailed-view';
import { ManuscriptDescription } from '@frontend/domain';
import { GetServerSideProps } from 'next';
import { getSchema } from '@frontend/server-side-queries';
import { useSchemaStore } from '@frontend/ui/store';

export function ManuscriptDescriptionPage({ schema }) {
  useSchemaStore('ManuscriptDescription', schema);
  useNavbarMessage(['Manuscript Description:', 'View Documents']);
  const { schemaFilter, changeSchemaFilter } = useSchemaFilter();
  const isMdScreen = useMediumScreenMediaQuery();

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
        }}
      >
        <DocumentsDetailedViewPage
          cls={ManuscriptDescription}
          schemaFilter={schemaFilter}
          groupToggle={
            <ManuscriptDescriptionGroupToggle
              schemaFilter={schemaFilter}
              changeSchemaFilter={changeSchemaFilter}
              view={isMdScreen ? 'menu' : 'toolbar'}
            />
          }
        />
      </DocumentViewContext.Provider>
    </>
  );
}

export default withTransition(ManuscriptDescriptionPage, {});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const schema = await getSchema('ManuscriptDescription');
  return {
    props: {
      schema,
    },
  };
};
