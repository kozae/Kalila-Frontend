import React, { useState } from 'react';
import styles from './modals.module.scss';
import { ActivitySchema, editorEntrySchema } from '@frontend/util';
import {
  IAdminPageContext,
  useAdminPageContext,
} from '../../admin-page.context';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { KalilaForm } from '@frontend/ui/forms';
import { KalilaDocument } from '@frontend/domain';
import Button from '@mui/material/Button';
import { DialogHeading, themeColors, UndrawAddSVG } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system/styleFunctionSx';

export interface ICreateModalProps<T extends KalilaDocument> {
  cls: ClassConstructor<T>; // just for type inference
  isOpen: boolean;
  schema?: ActivitySchema;
  onDismiss: () => void;
  onSubmit: ((doc: T) => void) | ((doc: T) => Promise<void>);
}

const style: SxProps = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  minWidth: '300px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

export const CreateDocumentModal = <T extends KalilaDocument>({
  isOpen,
  schema,
  onDismiss,
  onSubmit,
}: ICreateModalProps<T>) => {
  const {
    initialValues,
    validationSchemaFactory,
    editors,
    createModalTitle: title,
  } = useAdminPageContext<T>() as IAdminPageContext<T>;

  const [canCreate, setCanCreate] = useState(false);

  return (
    <Modal open={isOpen} onClose={onDismiss}>
      <Stack alignItems={'center'} sx={style} spacing={2}>
        <DialogHeading onDismiss={onDismiss}>
          <Typography color="white" variant="h5">
            {title}
          </Typography>
        </DialogHeading>
        <UndrawAddSVG color={themeColors.mainGreen} width={'200px'} />
        <Box sx={{ width: '300px' }}>
          {schema && editors ? (
            <KalilaForm
              initialValues={initialValues}
              fields={[...schema.Fields, editorEntrySchema]}
              categoricalAttributes={schema.CategoricalAttributes}
              editors={editors}
              formClass={styles['form']}
              onCanSubmit={(v) => setCanCreate(v)}
              validationSchema={validationSchemaFactory({ skip: {} })}
              onSubmit={onSubmit}
            >
              <div className={styles['form-actions']}>
                <Button
                  sx={{ typography: 'button' }}
                  startIcon={<AddIcon />}
                  variant="contained"
                  disableElevation
                  disabled={!canCreate}
                  type="submit"
                >
                  Create
                </Button>
              </div>
            </KalilaForm>
          ) : null}
        </Box>
      </Stack>
    </Modal>
  );
};
