import { CategoricalAttribute } from '@frontend/domain';
import { IDataEntrySchema } from '@frontend/util';
import { SxProps } from '@mui/system/styleFunctionSx';
import {
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import {
  DialogHeading,
  kalilaTheme,
  UndrawDocumentSVG,
} from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { KalilaForm } from '@frontend/ui/forms';
import styles from '../../generic-documents/modals/modals.module.scss';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';

export interface IEditAttributeModalProps {
  initialValues: CategoricalAttribute;
  isOpen: boolean;
  optionFieldSchema: IDataEntrySchema;
  onDismiss: () => void;
  onSubmit:
    | ((doc: CategoricalAttribute) => void)
    | ((doc: CategoricalAttribute) => Promise<void>);
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

export const EditAttributeModal = ({
  initialValues,
  isOpen,
  optionFieldSchema,
  onDismiss,
  onSubmit,
}: IEditAttributeModalProps) => {
  const { validationSchemaFactory } =
    useAdminPageContext<CategoricalAttribute>() as IAdminPageContext<CategoricalAttribute>;
  const [canEdit, setCanEdit] = useState(false);
  const skip = { Option: [initialValues.Option] };
  return (
    <Modal open={isOpen} onClose={onDismiss}>
      <Stack alignItems={'center'} sx={style} spacing={2}>
        <DialogHeading onDismiss={onDismiss}>
          <Typography color="white" variant="h5">
            Edit Attribute of {initialValues.FieldName} on{' '}
            {initialValues.EntityName}
          </Typography>
        </DialogHeading>
        <UndrawDocumentSVG
          color={kalilaTheme.palette.primary.main}
          width={'150px'}
        />
        <Box sx={{ width: '300px' }}>
          <KalilaForm
            initialValues={initialValues}
            fields={[optionFieldSchema]}
            categoricalAttributes={{}}
            editors={[]}
            formClass={styles['form']}
            onCanSubmit={(v) => setCanEdit(v)}
            validationSchema={validationSchemaFactory({ mode: 'edit', skip })}
            onSubmit={onSubmit}
          >
            <div className={styles['form-actions']}>
              <Button
                sx={{ typography: 'button' }}
                startIcon={<SaveIcon />}
                variant="contained"
                disableElevation
                disabled={!canEdit}
                type="submit"
              >
                Update
              </Button>
            </div>
          </KalilaForm>
        </Box>
      </Stack>
    </Modal>
  );
};
