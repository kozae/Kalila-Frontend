import React, {ReactNode, useEffect, useState} from "react";
import styles from './administration-page.module.scss'
import {
  AdministrationCommandBar,
  CreateDocumentModal,
  DeleteDocumentModal,
  EditDocumentModal,
  IAdminPageContext,
  useAdminPageContext
} from "@frontend/ui/administration";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {Grid, Paginator} from "@frontend/ui/table";
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
import {MessageBar} from "@fluentui/react";


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

  return <>
    {isMessageVisible && <MessageBar styles={{root: {width: 'fit-content', minWidth: '300px'}}}
                                     className='animate__animated animate__heartBeat'
                                     messageBarType={messageBarType} onDismiss={hideMessage}>
      {message}
    </MessageBar>}
    <div className={styles['commands']}>
      <AdministrationCommandBar
        cls={cls}
        selection={selection}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}/>
      <Paginator onPaginationChange={onPaginationChange}
                 pagination={state?.pagination ?? defaultPagination}
                 loading={loading}/>
    </div>
    <Grid gridParams={gridParams} loading={loading}>
      {columns}
    </Grid>
    {
      state?.schema && dispatchers?.createDocument && editors ? (
        <>
          <CreateDocumentModal
            cls={cls}
            isOpen={isCreateModalOpen}
            schema={state.schema}
            onDismiss={() => hideCreateModal()}
            onSubmit={handleCreate}/>
          <EditDocumentModal
            cls={cls}
            initialValues={editMode === 'one' ? selection[0] : initialValues}
            editMode={editMode}
            isOpen={isEditModalOpen}
            schema={state.schema}
            onDismiss={() => hideEditModal()}
            onSubmit={handleUpdate}/>
        </>
      ) : null
    }
    <DeleteDocumentModal
      isOpen={isDeleteModalOpen}
      onDismiss={() => hideDeleteModal()}
      doc={selection[0]}
      onConfirm={handleDelete}
    />
  </>
}
