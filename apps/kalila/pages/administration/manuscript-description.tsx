import {
  AdministrationPage,
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import React from 'react';
import { ManuscriptDescriptionAdmin } from '@frontend/domain';
import { checkStringValueFactory } from '@frontend/util';
import { useNavbarMessage } from '@frontend/shared-ui';
import { initGrid } from '@frontend/ui/table';

export function MSDAdministration() {
  useNavbarMessage(['Administration:', 'Manuscript Description']);
  const { editors, filter, handlePaginationChange, headerComponentParams } =
    initGrid();
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  const initialValues = new ManuscriptDescriptionAdmin();
  const columns: any[] = [
    {
      field: 'Siglum',
      pinned: 'left',
      lockPosition: true,
      headerComponent: 'stringValueHeader',
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
