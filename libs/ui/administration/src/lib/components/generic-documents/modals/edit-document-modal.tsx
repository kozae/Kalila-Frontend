import React, { useState } from 'react';
import styles from './modals.module.scss';
import {
  ActivitySchema,
  editionProgressEntrySchema,
  editorEntrySchema,
} from '@frontend/util';
import {
  IAdminPageContext,
  useAdminPageContext,
} from '../../../admin-page.context';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { KalilaForm } from '@frontend/ui/forms';
import { KalilaDocument } from '@frontend/domain';
import {
  DialogHeading,
  kalilaTheme,
  UndrawDocumentSVG,
} from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/system/styleFunctionSx';
import SaveIcon from '@mui/icons-material/Save';
import { selectEditors, useAppSelector } from '@frontend/ui/store';

function useSkipConfigObject<T extends KalilaDocument>(
  schema: ActivitySchema,
  initialValues: T,
  editMode: 'one' | 'many' | 'filtered'
) {
  const skip: Record<string, any[]> = {};

  schema.Fields.forEach((f) => {
    if (f.KeyField) {
      skip[f.FieldNamePascalCase] = [];
    }
  });

  Object.entries(initialValues ?? {}).forEach(([key, value]) => {
    if (Object.keys(skip).includes(key)) {
      skip[key].push(value);
      if (editMode === 'many' || editMode === 'filtered') {
        skip[key].push('', null, undefined, 0);
      }
    }
  });
  return skip;
}

export interface IEditModalProps<T extends KalilaDocument> {
  initialValues: T;
  cls: ClassConstructor<T>; // just for type inference
  isOpen: boolean;
  schema: ActivitySchema;
  editMode: 'one' | 'many' | 'filtered';
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

export const EditDocumentModal = <T extends KalilaDocument>({
  initialValues,
  isOpen,
  schema,
  onDismiss,
  editMode,
  onSubmit,
}: IEditModalProps<T>) => {
  const { validationSchemaFactory, editModalTitle: title } =
    useAdminPageContext<T>() as IAdminPageContext<T>;
  const editors = useAppSelector(selectEditors);

  const [canEdit, setCanEdit] = useState(false);
  const skip = useSkipConfigObject(schema, initialValues, editMode);

  return (
    <Modal open={isOpen} onClose={onDismiss}>
      <Stack alignItems={'center'} sx={style} spacing={2}>
        <DialogHeading onDismiss={onDismiss}>
          <Typography color="white" variant="h5">
            {title[editMode]}
          </Typography>
        </DialogHeading>
        <UndrawDocumentSVG
          color={kalilaTheme.palette.warning.main}
          width={'150px'}
        />
        <Box sx={{ width: '300px' }}>
          {schema && editors ? (
            <KalilaForm
              initialValues={initialValues}
              fields={
                editMode === 'one'
                  ? [
                      ...schema.Fields,
                      editorEntrySchema,
                      editionProgressEntrySchema,
                    ]
                  : [editorEntrySchema, editionProgressEntrySchema]
              }
              categoricalAttributes={schema.CategoricalAttributes}
              editors={editors}
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
          ) : null}
        </Box>
      </Stack>
    </Modal>
  );
};
