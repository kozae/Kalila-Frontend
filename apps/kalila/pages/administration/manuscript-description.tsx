import {
  AdministrationPage,
  createAdminPageContext,
  initAdminPage,
  withAdminLayout,
} from '@frontend/ui/administration';
import React from 'react';
import { AgGridColumn } from 'ag-grid-react';
import { ManuscriptDescriptionAdmin } from '@frontend/domain';
import { checkStringValueFactory } from '@frontend/util';
import { useNavbarMessage } from '@frontend/shared-ui';

export function MSDAdministration() {
  useNavbarMessage(['Administration:', 'Manuscript Description']);
  const { editors, filter, handlePaginationChange, headerComponentParams } =
    initAdminPage();
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  const initialValues = new ManuscriptDescriptionAdmin();
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
      <AdministrationPage cls={ManuscriptDescriptionAdmin}>
        <AgGridColumn
          headerComponent={'stringValueHeader'}
          pinned={'left'}
          headerComponentParams={headerComponentParams}
          lockPosition={true}
          field="Siglum"
        />
        <AgGridColumn
          headerComponent={'stringValueHeader'}
          headerComponentParams={headerComponentParams}
          field="Editor"
        />
        <AgGridColumn
          headerComponent={'stringValueHeader'}
          headerComponentParams={headerComponentParams}
          field="EditionProgress"
        />
      </AdministrationPage>
    </AdminPageContext.Provider>
  );
}

export default withAdminLayout(MSDAdministration, 0);
