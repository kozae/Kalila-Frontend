import { ActivitySchema } from '@frontend/util';
import { CategoricalAttribute } from '@frontend/domain';
import { SxProps } from '@mui/system/styleFunctionSx';
import {
  IAdminPageContext,
  useAdminPageContext,
} from '@frontend/ui/administration';
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { DialogHeading, kalilaTheme, UndrawAddSVG } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { KalilaForm } from '@frontend/ui/forms';
import styles from './modals.module.scss';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export interface ICreateAttributeModalProps {
  isOpen: boolean;
  schema?: ActivitySchema;
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

export const CreateAttributeModal = ({
  isOpen,
  schema,
  onDismiss,
  onSubmit,
}: ICreateAttributeModalProps) => {
  const {
    initialValues,
    validationSchemaFactory,
    createModalTitle: title,
  } = useAdminPageContext<CategoricalAttribute>() as IAdminPageContext<CategoricalAttribute>;

  const [canCreate, setCanCreate] = useState(false);

  return (
    <Modal open={isOpen} onClose={onDismiss}>
      <Stack alignItems={'center'} sx={style} spacing={2}>
        <DialogHeading onDismiss={onDismiss}>
          <Typography color="white" variant="h5">
            {title}
          </Typography>
        </DialogHeading>
        <UndrawAddSVG
          color={kalilaTheme.palette.primary.main}
          width={'200px'}
        />
        <Box sx={{ width: '300px' }}>
          {schema ? (
            <KalilaForm
              initialValues={initialValues}
              fields={schema.Fields}
              categoricalAttributes={schema.CategoricalAttributes}
              editors={[]}
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
