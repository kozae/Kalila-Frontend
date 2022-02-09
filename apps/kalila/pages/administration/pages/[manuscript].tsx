import {
  AdministrationPage,
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import { useNavbarMessage } from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { queryServerSide, siglum } from '@frontend/server-side-queries';
import Head from 'next/head';
import { PageDescriptionAdmin } from '@frontend/domain';
import { checkNumberValueFactory } from '@frontend/util';
import React from 'react';
import { initGrid } from '@frontend/ui/table';

function pageTitle(siglum: string): [string, string] {
  return ['Administration:', `Pages of ${siglum}`];
}

export function PagesAdministration({ siglum, manuscriptId }) {
  const messages = pageTitle(siglum);
  useNavbarMessage(messages);
  const { editors, filter, handlePaginationChange, headerComponentParams } =
    initGrid(['manuscript']);
  const AdminPageContext = createAdminPageContext<PageDescriptionAdmin>();
  const initialValues = new PageDescriptionAdmin();
  const columns: any[] = [
    {
      field: 'Number',
      pinned: 'left',
      lockPosition: true,
      headerComponent: 'numberValueHeader',
      headerComponentParams,
    },
    {
      field: 'Editor',
      headerComponent: 'stringValueHeader',
      headerComponentParams,
    },
    {
      field: 'EditionProgress',
      headerComponent: 'stringValueHeader',
      headerComponentParams,
    },
  ];
  return (
    <>
      <Head>
        <title>{messages.join(' ')}</title>
      </Head>
      <AdminPageContext.Provider
        value={{
          activityName: 'PageDescription',
          additionalParams: { ManuscriptId: manuscriptId },
          initialValues,
          validationSchemaFactory: initialValues.validationSchemaFactory(
            editors.map((v) => v.username),
            {
              Number: checkNumberValueFactory('PageDescription', 'Number', {
                ManuscriptId: manuscriptId,
              }),
            }
          ),
          cls: PageDescriptionAdmin,
          createModalTitle: 'Create a Page Description Document',
          editModalTitle: {
            one: 'Edit selected Page Description Document',
            many: 'Edit selected Page Description Documents',
            filtered: 'Edit filtered Page Description Document',
          },
          deleteModalMessage:
            'Deletion can be executed, only if the page does not have any narrative units assigned.',
          filter,
          editors,
          onPaginationChange: handlePaginationChange,
        }}
      >
        <AdministrationPage columns={columns} cls={PageDescriptionAdmin} />
      </AdminPageContext.Provider>
    </>
  );
}

export default withAdminLayout(PagesAdministration, 1);

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    const query = await queryServerSide({
      siglum: siglum(manuscriptId),
    });
    return {
      props: {
        ...query,
        manuscriptId,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/404',
      },
      props: {},
    };
  }
};
