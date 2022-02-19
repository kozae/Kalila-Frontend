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
import { GetStaticProps, GetStaticPaths } from 'next';
import { queryServerSide, sigla, siglum } from '@frontend/server-side-queries';
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
import { Column } from 'react-table';

function pageTitle(siglum: string): [string, string] {
  return ['Administration:', `Pages of ${siglum}`];
}

export function PagesAdministration({ siglum, manuscriptId }) {
  const messages = pageTitle(siglum);
  useNavbarMessage(messages);
  const editors = useAppSelector(selectEditors);
  const AdminPageContext = createAdminPageContext<PageDescriptionAdmin>();
  const initialValues = new PageDescriptionAdmin();
  const columns: ReadonlyArray<Column<PageDescriptionAdmin>> = React.useMemo(
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

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths: Array<
    string | { params: { manuscript: string }; locale?: string }
  > = [];
  const query = await queryServerSide({ sigla });
  for (const manuscript of query.sigla) {
    paths.push({ params: { manuscript: manuscript.Id } });
  }
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const manuscriptId = context.params['manuscript'] as string;
    console.log('generating page administration for: ', manuscriptId);
    const query = await queryServerSide({
      siglum: siglum(manuscriptId),
    });
    return {
      props: {
        ...query,
        manuscriptId,
      },
      revalidate: 30,
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
