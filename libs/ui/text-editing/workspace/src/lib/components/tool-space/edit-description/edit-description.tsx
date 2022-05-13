import { selectPageDescription, useAppSelector } from '@frontend/shared-ui';
import { CategoricalAttributes, schema } from './schema';
import { KalilaForm } from '@frontend/ui/forms';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import React, { useState } from 'react';
import styles from './style.module.scss';
import Stack from '@mui/material/Stack';
export const EditDescription = () => {
  const [canSubmit, setCanSubmit] = useState(false);

  const value = useAppSelector(selectPageDescription);
  const validationSchemaFactory = value.validationSchemaFactory(
    CategoricalAttributes
  );

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
        onSubmit={(v) => console.log(v)}
      >
        <div className={styles['form-action']}>
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
        </div>
      </KalilaForm>
    </Stack>
  );
};
