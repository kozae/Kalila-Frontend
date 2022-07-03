import {
  AdministrationPage,
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import {
  selectEditors,
  useAppSelector,
  useNavbarMessage,
} from '@frontend/shared-ui';
import { GetServerSideProps } from 'next';
import { siglum } from '@frontend/server-side-queries';
import Head from 'next/head';
import { PageDescriptionAdmin } from '@frontend/domain';
import { checkNumberValueFactory, KalilaValueTypes } from '@frontend/util';
import React from 'react';
import {
  EditorCell,
  GenericCell,
  getSelectionColumn,
  KeyValueCell,
  PrimaryGreenHeader,
  WhiteHeader,
} from '@frontend/ui/table';

function pageTitle(siglum: string): [string, string] {
  return ['Administration:', `Pages of ${siglum}`];
}

export function PagesAdministration({ siglum, manuscriptId }) {
  const messages = pageTitle(siglum);
  useNavbarMessage(messages);
  const editors = useAppSelector(selectEditors);
  const AdminPageContext = createAdminPageContext<PageDescriptionAdmin>();
  const initialValues = new PageDescriptionAdmin();
  const columns: ReadonlyArray<any> = React.useMemo(
    () => [
      getSelectionColumn<PageDescriptionAdmin>(),
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
  return (
    <>
      <Head>
        <title>{messages.join(' ')}</title>
      </Head>
      <AdminPageContext.Provider
        value={{
          activityName: 'Page',
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
          createModalTitle: 'Create a Page Document',
          editModalTitle: {
            one: 'Edit selected Page Document',
            many: 'Edit selected Page Documents',
            filtered: 'Edit filtered Page Document',
          },
          deleteModalMessage:
            'Deletion can be executed, only if the page does not have any narrative units assigned.',
        }}
      >
        <AdministrationPage
          gridHeight={'calc(100vh - 235px)'}
          columns={columns}
          cls={PageDescriptionAdmin}
          excludeFromFilter={['manuscript']}
        />
      </AdminPageContext.Provider>
    </>
  );
}

export default withAdminLayout(PagesAdministration, 1);

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    console.log('generating page administration for: ', manuscriptId);
    return {
      props: {
        siglum: await siglum(manuscriptId),
        manuscriptId,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
