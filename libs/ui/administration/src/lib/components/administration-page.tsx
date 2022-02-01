import React, {ReactNode, useCallback, useEffect, useState} from "react";
import styles from './administration-page.module.scss'
import {
  AdministrationCommandBar,
  CreateDocumentModal, EditDocumentModal,
  IAdminPageContext,
  useAdminPageContext
} from "@frontend/ui/administration";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {Grid, Paginator} from "@frontend/ui/table";
import {defaultPagination} from "@frontend/util";
import {useRouter} from "next/router";
import {useSignalrUpdates, usePaginatedDocuments} from "@frontend/shared-ui";
import {resetSelectionOnQueryChange, useControls, useGrid} from "../admin-page.hooks";
import {KalilaDocument} from "@frontend/domain";
import {IPaginatedDocumentsDispatchers} from "@frontend/shared-ui";


function useUpdateHandler<T extends KalilaDocument>(selection: T[],
                                                    filter: Record<string, any>,
                                                    editMode: 'one' | 'many' | 'filtered',
                                                    dispatchers: IPaginatedDocumentsDispatchers<T> | undefined
) {
  return useCallback(async (doc: T) => {
    const update = doc.CreateAdminUpdate(selection[0], editMode);
    const params = editMode === 'filtered' ? filter : {Ids: selection.map(d => d.Id)}
    if (dispatchers?.updateDocument) {
      await dispatchers.adminUpdateDocument(update, params)
    }
  }, [editMode, selection, dispatchers, filter])

}

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
    onCreate,
    onEdit,
    onDelete,
    hideCreateModal,
    hideEditModal
  } = useControls();
  const [selection, setSelection] = useState<T[]>([]);
  const [editMode, setEditMode] = useState<'one' | 'many' | 'filtered'>('filtered');

  useEffect(() => {
    setEditMode(selection.length === 0 ? 'filtered' : selection.length === 1 ? 'one' : 'many');
  }, [selection.length])

  const gridParams = useGrid({state, setSelection});

  const handleUpdate = useUpdateHandler(selection, filter, editMode, dispatchers)

  resetSelectionOnQueryChange(setSelection, router);
  useSignalrUpdates(activityName, dispatchers)

  return <>
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
            onSubmit={(doc) => dispatchers.createDocument(doc)}/>
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
  </>
}
