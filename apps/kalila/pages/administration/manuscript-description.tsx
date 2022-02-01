import {AdministrationPage, createAdminPageContext, initAdminPage, withAdminLayout} from "@frontend/ui/administration";
import React from "react";
import {AgGridColumn} from "ag-grid-react";
import {ManuscriptDescriptionAdmin} from "@frontend/domain";
import {checkStringValueFactory} from "@frontend/util";


export function MSDAdministration() {
  const {editors, filter, handlePaginationChange, headerComponentParams} = initAdminPage()
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  const initialValues = new ManuscriptDescriptionAdmin()
  return (
    <AdminPageContext.Provider
      value={{
        activityName: "ManuscriptDescription",
        initialValues,
        validationSchemaFactory: initialValues
          .validationSchemaFactory(editors.map(v => v.username), {"Siglum": checkStringValueFactory('ManuscriptDescription', 'Siglum')}),
        cls: ManuscriptDescriptionAdmin,
        createModalTitle: "Create a Manuscript Description Documents",
        editModalTitle: {
          one: 'Edit selected Manuscript Description Document',
          many: 'Edit selected Manuscript Description Documents',
          filtered: 'Edit filtered Manuscript Description Document'
        },
        filter,
        editors,
        onPaginationChange: handlePaginationChange,
      }}>
      <AdministrationPage cls={ManuscriptDescriptionAdmin}>
        <AgGridColumn headerComponent={'stringValueHeader'}
                      pinned={'left'}
                      headerComponentParams={headerComponentParams}
                      lockPosition={true}
                      field="Siglum"/>
        <AgGridColumn headerComponent={'stringValueHeader'}
                      headerComponentParams={headerComponentParams}
                      field="Editor"/>
        <AgGridColumn headerComponent={'stringValueHeader'}
                      headerComponentParams={headerComponentParams}
                      field="EditionProgress"/>
      </AdministrationPage>
    </AdminPageContext.Provider>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
