import {
  createAdminPageContext,
  withAdminLayout,
} from '@frontend/ui/administration';
import { useNavbarMessage } from '@frontend/shared-ui';
import React from 'react';
import { CategoricalAttribute } from '@frontend/domain';
import { AdministrationPageCategoricalAttributes } from '@frontend/ui/administration';
import { checkOptionDuplication } from '@frontend/util';
import Head from 'next/head';
import { initGrid } from '@frontend/ui/table';

export function CategoricalAttributesAdministration() {
  useNavbarMessage(['Administration:', 'Categorical Attributes']);
  const {
    filter,
    handlePaginationChange,
    headerComponentParams: baseHeaderParams,
  } = initGrid();
  const headerComponentParams = { ...baseHeaderParams, exactMatch: true };
  const AdminPageContext = createAdminPageContext<CategoricalAttribute>();
  const initialValues = new CategoricalAttribute();
  return (
    <>
      <Head>
        <title>Administration: Categorical Attributes</title>
      </Head>
      <AdminPageContext.Provider
        value={{
          activityName: 'CategoricalAttribute',
          additionalParams: {},
          initialValues,
          validationSchemaFactory: initialValues.validationSchemaFactory([], {
            Option: checkOptionDuplication,
          }),
          cls: CategoricalAttribute,
          createModalTitle: 'Create a Categorical Attribute',
          editModalTitle: {
            one: 'Edit selected Categorical Attribute',
            many: '',
            filtered: '',
          },
          deleteModalMessage:
            'Deletion can be executed, only if the attribute is unused.',
          filter,
          editors: [],
          onPaginationChange: handlePaginationChange,
        }}
      >
        <AdministrationPageCategoricalAttributes
          headerComponentParams={headerComponentParams}
        />
      </AdminPageContext.Provider>
    </>
  );
}

export default withAdminLayout(CategoricalAttributesAdministration, 2);
