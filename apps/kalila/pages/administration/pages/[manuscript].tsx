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
import { checkNumberValueFactory, KalilaValueTypes } from '@frontend/util';
import React from 'react';
import {
  GenericCell,
  getSelectionColumn,
  initGrid,
  PrimaryGreenHeader,
  WhiteHeader,
} from '@frontend/ui/table';
import { Column } from 'react-table';

function pageTitle(siglum: string): [string, string] {
  return ['Administration:', `Pages of ${siglum}`];
}

export function PagesAdministration({ siglum, manuscriptId }) {
  const messages = pageTitle(siglum);
  useNavbarMessage(messages);
  const {
    editors,
    filter,
    selection,
    setSelection,
    clearSelection,
    handlePaginationChange,
    headerProps,
  } = initGrid(['manuscript']);
  const AdminPageContext = createAdminPageContext<PageDescriptionAdmin>();
  const initialValues = new PageDescriptionAdmin();
  const columns: ReadonlyArray<Column<PageDescriptionAdmin>> = React.useMemo(
    () => [
      getSelectionColumn<PageDescriptionAdmin>(selection, setSelection),
      {
        Header: PrimaryGreenHeader,
        accessor: 'Number',
        f: {
          FieldNamePascalCase: 'Number',
          FieldDisplay: 'Number',
          KalilaValueType: KalilaValueTypes.Int,
        },
        Cell: GenericCell,
      },
      {
        Header: PrimaryGreenHeader,
        accessor: 'Editor',
        f: {
          FieldNamePascalCase: 'Editor',
          FieldDisplay: 'Editor',
          KalilaValueType: KalilaValueTypes.String,
        },
        Cell: GenericCell,
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
          selection,
          setSelection,
          clearSelection,
        }}
      >
        <AdministrationPage
          gridHeight={'calc(100vh - 235px)'}
          columns={columns}
          cls={PageDescriptionAdmin}
          headerProps={headerProps}
        />
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
