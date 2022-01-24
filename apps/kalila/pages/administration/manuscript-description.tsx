import {AdministrationCommandBar, useAdminPage, withAdminLayout} from "@frontend/ui/administration";
import React from "react";
import {defaultPagination} from "@frontend/util";
import {Grid, Paginator} from "@frontend/ui/table";
import styles from './index.module.scss';
import {ManuscriptDescriptionAdmin} from "@frontend/domain";
import {AgGridColumn} from "ag-grid-react";
import {AgGridReactProps, AgReactUiProps} from "ag-grid-react/lib/shared/interfaces";
import {useId, useBoolean} from '@fluentui/react-hooks';
import {FontWeights, getTheme, IButtonStyles, IconButton, mergeStyleSets, Modal} from "@fluentui/react";


const theme = getTheme();
const modalStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: {margin: '14px 0'},
      'p:first-child': {marginTop: 0},
      'p:last-child': {marginBottom: 0},
    },
  },
});

const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};


export function MSDAdministration() {
  const {
    loading,
    documents,
    pagination,
    filter,
    sort,
    selection,
    setSelection,
    handlePaginationChange,
    handleSortChange,
    handleFilterChange
  } = useAdminPage<ManuscriptDescriptionAdmin>('ManuscriptDescription', ManuscriptDescriptionAdmin)
  const [isCreateModalOpen, {setTrue: showCreateModal, setFalse: hideCreateModal}] = useBoolean(false);
  const [isEditModalOpen, {setTrue: showEditModal, setFalse: hideEditModal}] = useBoolean(false);
  const createTitleId = useId('createTitle');


  const onCreate = () => showCreateModal();
  const onEdit = () => showEditModal();
  const onDelete = () => console.log('delete')

  const gridParams: AgGridReactProps | AgReactUiProps = {
    onSelectionChanged: (event) => setSelection(event.api.getSelectedRows()),
    rowData: documents ?? []
  }

  const headerComponentParams = {
    activeSort: {...sort},
    activeFilter: {...filter},
    onSort: handleSortChange,
    onFilter: handleFilterChange
  };


  return (
    <>
      <div className={styles['commands']}>
        <AdministrationCommandBar
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
          enableDelete={selection.length === 1 && Object.keys(filter).length === 0}
          enableEditSelection={selection.length > 0}
          enableEditByFilter={Object.keys(filter).length > 0}/>
        <Paginator pagination={pagination ?? defaultPagination}
                   loading={loading}
                   onPaginationChange={handlePaginationChange}/>
      </div>
      <Grid gridParams={gridParams} loading={loading}>
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
      </Grid>
      <Modal
        titleAriaId={createTitleId}
        isOpen={isCreateModalOpen}
        onDismiss={hideCreateModal}
        isBlocking={false}
        containerClassName={modalStyles.container}
      >
        <div className={modalStyles.header}>
          <span id={createTitleId}>Create a Manuscript Description Document</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={{iconName: 'Cancel'}}
            ariaLabel="Close create modal"
            onClick={hideCreateModal}
          />
        </div>
        <div className={modalStyles.body}>

        </div>
      </Modal>
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
