import { IDataEntrySchema } from '@frontend/util';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

const useFormControlProps = (field: IDataEntrySchema, errors: any) => ({
  sx: { m: '1rem', width: '100%', typography: 'body1' },
  error: errors[field.FieldNamePascalCase] !== undefined,
});

const useCommonInputProps = (field: IDataEntrySchema, handleBlur: any) => ({
  name: field.FieldNamePascalCase,
  label: field.FieldDisplay,
  onBlur: handleBlur,
});

export const useCommonFieldProps = (
  field: IDataEntrySchema,
  errors: any,
  handleBlur: any,
  labelId: string,
  values: any
) => ({
  value: values[field.FieldNamePascalCase],
  formControlProps: useFormControlProps(field, errors),
  commonInputProps: useCommonInputProps(field, handleBlur),
  inputLabel: <InputLabel id={labelId}>{field.FieldNamePascalCase}</InputLabel>,
  helperText: (
    <FormHelperText sx={{ height: '.8rem' }}>
      {errors[field.FieldNamePascalCase] ?? '  '}
    </FormHelperText>
  ),
});
