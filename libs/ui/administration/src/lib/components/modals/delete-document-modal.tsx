import React from "react";
import {DefaultButton, IconButton, Modal, PrimaryButton} from "@fluentui/react";
import {useId} from "@fluentui/react-hooks";
import {IAdminPageContext, useAdminPageContext} from "../../admin-page.context";
import {iconButtonStyles, modalStyles, redColor} from "./fluent-ui.styles";
import {KalilaDocument} from "@frontend/domain";
import styles from "./modals.module.scss";


export interface IDeleteModalProps<T extends KalilaDocument> {
  doc: T,
  isOpen: boolean,
  onDismiss: () => void,
  onConfirm: ((doc: T) => void) | ((doc: T) => Promise<void>)
}

export const DeleteDocumentModal = <T extends KalilaDocument>(
  {
    doc,
    isOpen,
    onDismiss,
    onConfirm
  }: IDeleteModalProps<T>) => {

  const {
    deleteModalMessage: message
  } = useAdminPageContext<T>() as IAdminPageContext<T>;


  const deleteTitleId = useId('deleteTitle');

  return <Modal
    titleAriaId={deleteTitleId}
    isOpen={isOpen}
    onDismiss={onDismiss}
    isBlocking={false}
    containerClassName={modalStyles.container}
  >
    <div className={modalStyles.header}>
      <span id={deleteTitleId}>Are you sure you want to delete this document?</span>
      <IconButton
        styles={iconButtonStyles}
        iconProps={{iconName: 'Cancel'}}
        ariaLabel="Close delete modal"
        onClick={onDismiss}
      />
    </div>
    <div className={modalStyles.body}>
      <div>
        <h3>{message}</h3>
      </div>
      <div className={styles['delete-btn']}>
        <DefaultButton iconProps={{iconName: 'Delete'}}
                       styles={{
                         label: {fontWeight: 'normal'},
                         icon: {color: redColor},
                         root: {color: redColor, borderColor: redColor}
                       }}
                       text="Attempt deletion"
                       onClick={() => onConfirm(doc)}/>
      </div>
    </div>
  </Modal>
}
