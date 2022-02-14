import {
  AdministrationPage,
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import React from 'react';
import { ManuscriptDescriptionAdmin } from '@frontend/domain';
import { checkStringValueFactory, KalilaValueTypes } from '@frontend/util';
import { useNavbarMessage } from '@frontend/shared-ui';
import {
  GenericCell,
  initGrid,
  PrimaryGreenHeader,
  WhiteHeader,
  getSelectionColumn,
} from '@frontend/ui/table';
import { Column } from 'react-table';
export function MSDAdministration() {
  useNavbarMessage(['Administration:', 'Manuscript Description']);
  const {
    editors,
    filter,
    selection,
    setSelection,
    clearSelection,
    handlePaginationChange,
    headerProps,
  } = initGrid();
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  const initialValues = new ManuscriptDescriptionAdmin();
  const columns: ReadonlyArray<Column<ManuscriptDescriptionAdmin>> =
    React.useMemo(
      () => [
        getSelectionColumn<ManuscriptDescriptionAdmin>(selection, setSelection),
        {
          Header: PrimaryGreenHeader,
          accessor: 'Siglum',
          f: {
            FieldNamePascalCase: 'Siglum',
            FieldDisplay: 'Siglum',
            KalilaValueType: KalilaValueTypes.String,
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
    <AdminPageContext.Provider
      value={{
        activityName: 'ManuscriptDescription',
        additionalParams: {},
        initialValues,
        validationSchemaFactory: initialValues.validationSchemaFactory(
          editors.map((v) => v.username),
          { Siglum: checkStringValueFactory('ManuscriptDescription', 'Siglum') }
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
        cls={ManuscriptDescriptionAdmin}
        headerProps={headerProps}
      />
    </AdminPageContext.Provider>
  );
}

export default withAdminLayout(MSDAdministration, 0);
