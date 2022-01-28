import {AdministrationPage, createAdminPageContext, initAdminPage, withAdminLayout} from "@frontend/ui/administration";
import React from "react";
import {AgGridColumn} from "ag-grid-react";
import {ManuscriptDescriptionAdmin} from "@frontend/domain";


export function MSDAdministration() {
  const {editors, filter, handlePaginationChange, headerComponentParams} = initAdminPage()
  const AdminPageContext = createAdminPageContext<ManuscriptDescriptionAdmin>();
  return (
    <AdminPageContext.Provider
      value={{
        activityName: "ManuscriptDescription",
        initialValues: new ManuscriptDescriptionAdmin(),
        validationSchema: ManuscriptDescriptionAdmin.getValidationSchema(editors.map(v => v.username)),
        cls: ManuscriptDescriptionAdmin,
        createModalTitle: "Create a Manuscript Description Documents",
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
