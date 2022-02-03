import React, {ReactNode, useCallback, useEffect, useState} from "react";
import styles from './administration-page.module.scss'
import {
  AdministrationCommandBar,
  IAdminPageContext,
  useAdminPageContext
} from "@frontend/ui/administration";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {Grid} from "@frontend/ui/table";
import Collapse from '@mui/material/Collapse';
import {defaultPagination} from "@frontend/util";
import {useRouter} from "next/router";
import {usePaginatedDocuments, useSignalrUpdates} from "@frontend/shared-ui";
import {
  resetSelectionOnQueryChange,
  useControls, useCreateHandler,
  useDeleteHandler,
  useGrid, useMessageBar,
  useUpdateHandler
} from "../admin-page.hooks";
import {KalilaDocument} from "@frontend/domain";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TablePagination from '@mui/material/TablePagination';
import {AlertColor} from "@mui/material/Alert/Alert";


export interface IAdministrationPageProps<T extends KalilaDocument> {
  cls: ClassConstructor<T> // just for type inference
  children: ReactNode
}

export const AdministrationPage = <T extends KalilaDocument>({cls, children: columns}: IAdministrationPageProps<T>) => {
  const router = useRouter();
  const {
    activityName,
    editors,
    initialValues,
    filter,
    onPaginationChange
  } = useAdminPageContext<T>() as IAdminPageContext<T>;
  const {state, dispatchers, loading} = usePaginatedDocuments<T>(activityName, router, cls);
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    onCreate,
    onEdit,
    onDelete,
    hideCreateModal,
    hideEditModal,
    hideDeleteModal
  } = useControls();
  const [selection, setSelection] = useState<T[]>([]);
  const [editMode, setEditMode] = useState<'one' | 'many' | 'filtered'>('filtered');
  const {message, messageBarType, isMessageVisible, hideMessage, notifyUser} = useMessageBar();
  const handleUpdate = useUpdateHandler(selection, filter, editMode, notifyUser, dispatchers, hideEditModal)
  const handleDelete = useDeleteHandler(notifyUser, dispatchers, hideDeleteModal)
  const handleCreate = useCreateHandler(notifyUser, dispatchers, hideCreateModal)

  useEffect(() => {
    setEditMode(selection.length === 0 ? 'filtered' : selection.length === 1 ? 'one' : 'many');
  }, [selection.length])

  const gridParams = useGrid({state, setSelection});


  resetSelectionOnQueryChange(setSelection, router);
  useSignalrUpdates(activityName, dispatchers)

  const handleChangePage = useCallback(async (e: any, page: number) => {
    if (state?.pagination) {
      await onPaginationChange({...state.pagination, currentPage: page})
    } else {
      await onPaginationChange({...defaultPagination, currentPage: page})
    }
  }, [onPaginationChange, state?.pagination])


  const handleChangeRowsPerPage = useCallback(async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (state?.pagination) {
      await onPaginationChange({...state.pagination, itemsPerPage: parseInt(e.target.value, 10)})
    } else {
      await onPaginationChange({...defaultPagination, itemsPerPage: parseInt(e.target.value, 10)})
    }
  }, [onPaginationChange, state?.pagination])

  return <>
    <Collapse in={isMessageVisible}>
      <Alert
        sx={{width: 'fit-content', minWidth: '300px', mb: 2}}
        severity={messageBarType as AlertColor}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={hideMessage}
          >
            <CloseIcon fontSize="inherit"/>
          </IconButton>
        }>
        {message}
      </Alert>
    </Collapse>
    <div className={styles['commands']}>
      <AdministrationCommandBar
        cls={cls}
        selection={selection}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}/>
      <TablePagination
        sx={{typography: 'button'}}
        component="div"
        count={state?.pagination?.totalItems ?? defaultPagination.totalItems}
        page={state?.pagination?.currentPage ?? defaultPagination.currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={state?.pagination?.itemsPerPage ?? defaultPagination.itemsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
    <Grid gridParams={gridParams} loading={loading ?? false}>
      {columns}
    </Grid>
    {/*{*/}
    {/*  state?.schema && dispatchers?.createDocument && editors ? (*/}
    {/*    <>*/}
    {/*      <CreateDocumentModal*/}
    {/*        cls={cls}*/}
    {/*        isOpen={isCreateModalOpen}*/}
    {/*        schema={state.schema}*/}
    {/*        onDismiss={() => hideCreateModal()}*/}
    {/*        onSubmit={handleCreate}/>*/}
    {/*      <EditDocumentModal*/}
    {/*        cls={cls}*/}
    {/*        initialValues={editMode === 'one' ? selection[0] : initialValues}*/}
    {/*        editMode={editMode}*/}
    {/*        isOpen={isEditModalOpen}*/}
    {/*        schema={state.schema}*/}
    {/*        onDismiss={() => hideEditModal()}*/}
    {/*        onSubmit={handleUpdate}/>*/}
    {/*    </>*/}
    {/*  ) : null*/}
    {/*}*/}
    {/*<DeleteDocumentModal*/}
    {/*  isOpen={isDeleteModalOpen}*/}
    {/*  onDismiss={() => hideDeleteModal()}*/}
    {/*  doc={selection[0]}*/}
    {/*  onConfirm={handleDelete}*/}
    {/*/>*/}
  </>
}
