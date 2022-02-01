import React, {useState} from "react";
import styles from './modals.module.scss'
import {IconButton, Modal, PrimaryButton} from "@fluentui/react";
import {ActivitySchema, editorEntrySchema} from "@frontend/util";
import {useId} from "@fluentui/react-hooks";
import {IAdminPageContext, useAdminPageContext} from "../../admin-page.context";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {KalilaForm} from "@frontend/ui/forms";
import {iconButtonStyles, modalStyles} from "./fluent-ui.styles";
import {KalilaDocument} from "@frontend/domain";


export interface ICreateModalProps<T extends KalilaDocument> {
  cls: ClassConstructor<T> // just for type inference
  isOpen: boolean,
  schema?: ActivitySchema,
  onDismiss: () => void,
  onSubmit: ((doc: T) => void) | ((doc: T) => Promise<void>)
}

export const CreateDocumentModal = <T extends KalilaDocument>(
  {
    isOpen,
    schema,
    onDismiss,
    onSubmit
  }: ICreateModalProps<T>) => {

  const {
    initialValues,
    validationSchemaFactory,
    editors,
    createModalTitle: title
  } = useAdminPageContext<T>() as IAdminPageContext<T>;

  const [canCreate, setCanCreate] = useState(false);
  const createTitleId = useId('createTitle');

  return <Modal
    titleAriaId={createTitleId}
    isOpen={isOpen}
    onDismiss={onDismiss}
    isBlocking={false}
    containerClassName={modalStyles.container}
  >
    <div className={modalStyles.header}>
      <span id={createTitleId}>{title}</span>
      <IconButton
        styles={iconButtonStyles}
        iconProps={{iconName: 'Cancel'}}
        ariaLabel="Close create modal"
        onClick={onDismiss}
      />
    </div>
    <div className={modalStyles.body}>
      {
        schema && editors ? (<KalilaForm initialValues={initialValues}
                                         fields={[...schema.Fields, editorEntrySchema]}
                                         categoricalAttributes={schema.CategoricalAttributes}
                                         editors={editors}
                                         formClass={styles['form']}
                                         onCanSubmit={(v) => setCanCreate(v)}
                                         validationSchema={validationSchemaFactory({skip: {}})}
                                         onSubmit={onSubmit}>
            <div className={styles['form-actions']}>
              <PrimaryButton iconProps={{iconName: 'Add'}} styles={{label: {fontWeight: 'normal'}}} text="Create"
                             disabled={!canCreate}
                             type="submit"/>
            </div>

          </KalilaForm>
        ) : null
      }
    </div>
  </Modal>
}
