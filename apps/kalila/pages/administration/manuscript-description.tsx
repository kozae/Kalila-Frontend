import {
  AdministrationPage,
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import React from 'react';
import { ManuscriptDescriptionAdmin } from '@frontend/domain';
import { checkStringValueFactory, KalilaValueTypes } from '@frontend/util';
import {
  selectEditors,
  useAppSelector,
  useNavbarMessage,
} from '@frontend/shared-ui';
import {
  GenericCell,
  PrimaryGreenHeader,
  WhiteHeader,
  getSelectionColumn,
  EditorCell,
} from '@frontend/ui/table';
import { Column } from 'react-table';
import Head from 'next/head';
import { KeyValueCell } from '@frontend/ui/table';
export function MSDAdministration() {
  useNavbarMessage(['Administration:', 'Manuscript Description']);
  const editors = useAppSelector(selectEditors);
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  const initialValues = new ManuscriptDescriptionAdmin();
  const columns: ReadonlyArray<Column<ManuscriptDescriptionAdmin>> =
    React.useMemo(
      () => [
        getSelectionColumn<ManuscriptDescriptionAdmin>(),
        {
          Header: PrimaryGreenHeader,
          accessor: 'Siglum',
          f: {
            FieldNamePascalCase: 'Siglum',
            FieldDisplay: 'Siglum',
            KalilaValueType: KalilaValueTypes.String,
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
        <title>Administration: Manuscript Description</title>
      </Head>
      <AdminPageContext.Provider
        value={{
          activityName: 'ManuscriptDescription',
          additionalParams: {},
          initialValues,
          validationSchemaFactory: initialValues.validationSchemaFactory(
            editors.map((v) => v.username),
            {
              Siglum: checkStringValueFactory(
                'ManuscriptDescription',
                'Siglum'
              ),
            }
          ),
          cls: ManuscriptDescriptionAdmin,
          createModalTitle: 'Create a Manuscript Description Document',
          editModalTitle: {
            one: 'Edit selected Manuscript Description Document',
            many: 'Edit selected Manuscript Description Documents',
            filtered: 'Edit filtered Manuscript Description Document',
          },
          deleteModalMessage:
            'Deletion can be executed, only if the manuscript does not have any pages assigned.',
        }}
      >
        <AdministrationPage
          gridHeight={'calc(100vh - 235px)'}
          columns={columns}
          cls={ManuscriptDescriptionAdmin}
        />
      </AdminPageContext.Provider>
    </>
  );
}

export default withAdminLayout(MSDAdministration, 0);
