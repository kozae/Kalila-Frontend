import React, {ReactNode, useState} from "react";
import styles from './administration-page.module.scss'
import {
  AdministrationCommandBar,
  CreateDocumentModal,
  IAdminPageContext,
  useAdminPageContext
} from "@frontend/ui/administration";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {Grid, Paginator} from "@frontend/ui/table";
import {defaultPagination} from "@frontend/util";
import {useRouter} from "next/router";
import {useSignalrUpdates, usePaginatedDocuments} from "@frontend/shared-ui";
import {resetSelectionOnQueryChange, useControls, useGrid} from "../admin-page.hooks";


export interface IAdministrationPageProps<T extends object> {
  cls: ClassConstructor<T> // just for type inference
  children: ReactNode
}

export const AdministrationPage = <T extends object>({cls, children: columns}: IAdministrationPageProps<T>) => {
  const router = useRouter();
  const {activityName, editors, onPaginationChange} = useAdminPageContext<T>() as IAdminPageContext<T>;
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
  const [selection, setSelection] = useState<string[]>([]);

  const gridParams = useGrid({state, setSelection});

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
        <CreateDocumentModal
          cls={cls}
          isOpen={isCreateModalOpen}
          schema={state.schema}
          onDismiss={() => hideCreateModal()}
          onSubmit={(doc) => dispatchers.createDocument(doc)}/>
      ) : null
    }
  </>
}
