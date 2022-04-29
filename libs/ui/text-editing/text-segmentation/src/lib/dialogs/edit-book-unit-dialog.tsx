import Modal from '@mui/material/Modal';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { BookUnit } from '@frontend/domain';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { KalilaForm } from '@frontend/ui/forms';
import { bookUnitSchema } from './helpers';
import { ObjectSchema } from 'yup';
import { AnySchema } from 'yup/lib/schema';
import styles from './edit-book-unit-dialog.module.scss';
import {
  checkNumberValueFactory,
  checkStringValueFactory,
} from '@frontend/util';

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

export interface IEditBookUnitDialogProps {
  value: BookUnit;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (v: BookUnit) => Promise<void>;
}

export const EditBookUnitDialog = ({
  value,
  isOpen,
  onClose,
  onSubmit,
}: IEditBookUnitDialogProps) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const validationSchemaFactory = value.validationSchemaFactory([], {
    Title: checkStringValueFactory('BookUnit', 'Title'),
    OrderInChapter: checkNumberValueFactory('BookUnit', 'OrderInChapter', {
      ChapterCn: value.Chapter,
    }),
  });

  return (
    <Portal>
      <Modal open={isOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading onDismiss={onClose}>
            <Typography color="white" variant="h5">
              Edit Book Unit
            </Typography>
          </DialogHeading>
          <KalilaForm
            initialValues={value}
            fields={bookUnitSchema.Fields.filter((f) =>
              ['Title', 'OrderInChapter'].includes(f.FieldNamePascalCase)
            )}
            categoricalAttributes={bookUnitSchema.CategoricalAttributes}
            editors={[]}
            formClass={styles['form']}
            onCanSubmit={(v) => setCanSubmit(v)}
            validationSchema={
              validationSchemaFactory({
                mode: 'edit',
                skip: {
                  Chapter: [],
                  OrderInChapter: [value.OrderInChapter],
                  Title: [value.Title],
                },
              }) as ObjectSchema<Record<any, AnySchema>>
            }
            onSubmit={onSubmit}
          >
            <div className={styles['form-actions']}>
              <Button
                sx={{ typography: 'button' }}
                startIcon={<SaveIcon />}
                variant="contained"
                disableElevation
                disabled={!canSubmit}
                type="submit"
              >
                Update
              </Button>
            </div>
          </KalilaForm>
        </Stack>
      </Modal>
    </Portal>
  );
};
