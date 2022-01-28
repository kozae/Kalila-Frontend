import React, {useState} from "react";
import styles from './modals.module.scss'
import {
  FontWeights,
  getTheme,
  IButtonStyles,
  IconButton,
  mergeStyleSets,
  Modal,
  PrimaryButton
} from "@fluentui/react";
import { KalilaForm} from "@frontend/ui/forms";
import {ActivitySchema, editorEntrySchema} from "@frontend/util";
import {useId} from "@fluentui/react-hooks";
import {IAdminPageContext, useAdminPageContext} from "../../admin-page.context";
import {ClassConstructor} from "class-transformer/types/interfaces";

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


export interface ICreateModalProps<T extends object> {
  cls: ClassConstructor<T> // just for type inference
  isOpen: boolean,
  schema?: ActivitySchema,
  onDismiss: () => void,
  onSubmit: ((doc: T) => void) | ((doc: T) => Promise<void>)
}

export const CreateDocumentModal = <T extends object>(
  {
    isOpen,
    schema,
    onDismiss,
    onSubmit
  }: ICreateModalProps<T>) => {

  const {
    initialValues,
    validationSchema,
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
                                         validationSchema={validationSchema}
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
