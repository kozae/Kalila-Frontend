import {
  saveDescriptionChanges,
  selectPageDescription,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { CategoricalAttributes, schema } from './schema';
import { KalilaForm } from '@frontend/ui/forms';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import React, { useState } from 'react';
import styles from './style.module.scss';
import Stack from '@mui/material/Stack';
import { PageDescription } from '@frontend/domain';

export const EditDescription = () => {
  const [canSubmit, setCanSubmit] = useState(false);

  const value = useAppSelector(selectPageDescription);
  const validationSchemaFactory = value.validationSchemaFactory(
    CategoricalAttributes
  );

  const dispatch = useAppDispatch();
  const onSave = (v: PageDescription) => {
    dispatch(setTextEditingToolMode('default'));
    dispatch(saveDescriptionChanges(v));
  };
  return (
    <Stack width="100%" alignItems="center" overflow="scroll">
      <KalilaForm
        initialValues={value}
        fields={schema.Fields}
        categoricalAttributes={CategoricalAttributes}
        editors={[]}
        formClass={styles['form']}
        onCanSubmit={(v) => setCanSubmit(v)}
        validationSchema={validationSchemaFactory()}
        onSubmit={onSave}
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
            Save
          </Button>
          <Button
            sx={{ typography: 'button' }}
            variant="text"
            color="secondary"
            onClick={() => dispatch(setTextEditingToolMode('default'))}
          >
            Cancel
          </Button>
        </div>
      </KalilaForm>
    </Stack>
  );
};
