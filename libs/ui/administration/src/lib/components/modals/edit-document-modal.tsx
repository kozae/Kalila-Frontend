import React, {useState} from "react";
import styles from './modals.module.scss'
import {
  IconButton,
  Modal,
  PrimaryButton
} from "@fluentui/react";
import {ActivitySchema, editionProgressEntrySchema, editorEntrySchema} from "@frontend/util";
import {useId} from "@fluentui/react-hooks";
import {IAdminPageContext, useAdminPageContext} from "../../admin-page.context";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {KalilaForm} from "@frontend/ui/forms";
import {iconButtonStyles, modalStyles} from "./fluent-ui.styles";
import {KalilaDocument} from "@frontend/domain";


function useSkipConfigObject<T extends KalilaDocument>(schema: ActivitySchema, initialValues: T, editMode: 'one' | 'many' | 'filtered') {
  const skip: Record<string, any[]> = {};

  schema.Fields.forEach(f => {
    if (f.KeyField) {
      skip[f.FieldNamePascalCase] = []
    }
  })

  Object.entries(initialValues ?? {}).forEach(([key, value]) => {
    if (Object.keys(skip).includes(key)) {
      skip[key].push(value)
      if (editMode === 'many' || editMode === 'filtered') {
        skip[key].push('', null, undefined, 0)
      }
    }
  })
  return skip;
}

export interface IEditModalProps<T extends KalilaDocument> {
  initialValues: T,
  cls: ClassConstructor<T> // just for type inference
  isOpen: boolean,
  schema: ActivitySchema,
  editMode: 'one' | 'many' | 'filtered',
  onDismiss: () => void,
  onSubmit: ((doc: T) => void) | ((doc: T) => Promise<void>)
}

export const EditDocumentModal = <T extends KalilaDocument>(
  {
    initialValues,
    isOpen,
    schema,
    onDismiss,
    editMode,
    onSubmit
  }: IEditModalProps<T>) => {

  const {
    validationSchemaFactory,
    editors,
    editModalTitle: title
  } = useAdminPageContext<T>() as IAdminPageContext<T>;

  const [canEdit, setCanEdit] = useState(false);
  const editTitleId = useId('editTitle');
  const skip = useSkipConfigObject(schema, initialValues, editMode);

  return <Modal
    titleAriaId={editTitleId}
    isOpen={isOpen}
    onDismiss={onDismiss}
    isBlocking={false}
    containerClassName={modalStyles.container}
  >
    <div className={modalStyles.header}>
      <span id={editTitleId}>{title[editMode]}</span>
      <IconButton
        styles={iconButtonStyles}
        iconProps={{iconName: 'Cancel'}}
        ariaLabel="Close edit modal"
        onClick={onDismiss}
      />
    </div>
    <div className={modalStyles.body}>
      {
        schema && editors ? (<KalilaForm initialValues={initialValues}
                                         fields={
                                           editMode === 'one'
                                             ? [...schema.Fields, editorEntrySchema, editionProgressEntrySchema]
                                             : [editorEntrySchema, editionProgressEntrySchema]
                                         }
                                         categoricalAttributes={schema.CategoricalAttributes}
                                         editors={editors}
                                         formClass={styles['form']}
                                         onCanSubmit={(v) => setCanEdit(v)}
                                         validationSchema={validationSchemaFactory({mode: 'edit', skip})}
                                         onSubmit={onSubmit}>
            <div className={styles['form-actions']}>
              <PrimaryButton iconProps={{iconName: 'Save'}} styles={{label: {fontWeight: 'normal'}}} text="Update"
                             disabled={!canEdit}
                             type="submit"/>
            </div>

          </KalilaForm>
        ) : null
      }
    </div>
  </Modal>
}
