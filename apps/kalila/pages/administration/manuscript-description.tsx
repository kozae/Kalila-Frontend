import {
  AdministrationPage,
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import React from 'react';
import { ManuscriptDescriptionAdmin } from '@frontend/domain';
import { checkStringValueFactory } from '@frontend/util';
import { useNavbarMessage } from '@frontend/shared-ui';
import { initGrid, StringValueHeader } from '@frontend/ui/table';
import { Column } from 'react-table';

export function MSDAdministration() {
  useNavbarMessage(['Administration:', 'Manuscript Description']);
  const { editors, filter, handlePaginationChange, headerComponentParams } =
    initGrid();
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  const initialValues = new ManuscriptDescriptionAdmin();
  const columns: ReadonlyArray<Column<ManuscriptDescriptionAdmin>> =
    React.useMemo(
      () => [
        {
          Header: () => (
            <StringValueHeader
              Id="Siglum"
              displayName="Siglum"
              {...headerComponentParams}
            />
          ),
          accessor: 'Siglum',
          Cell: ({ value }: any) => <h1>{value}</h1>,
        },
        {
          Header: () => (
            <StringValueHeader
              Id="Editor"
              displayName="Editor"
              {...headerComponentParams}
            />
          ),
          accessor: 'Editor',
        },
        {
          Header: () => (
            <StringValueHeader
              Id="EditionProgress"
              displayName="EditionProgress"
              {...headerComponentParams}
            />
          ),
          accessor: 'EditionProgress',
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
      }}
    >
      <AdministrationPage columns={columns} cls={ManuscriptDescriptionAdmin} />
    </AdminPageContext.Provider>
  );
}

export default withAdminLayout(MSDAdministration, 0);
