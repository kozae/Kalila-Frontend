import {
  DataEntrySchema,
  editionProgressOptions,
  InputModes,
  KalilaValueTypes,
} from '@frontend/util';
import { AnySchema } from 'yup/lib/schema';
import { ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { IEditor } from '@frontend/shared-ui';
import { KalilaDocument } from '@frontend/domain';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

export interface IKalilaFormProps<T extends KalilaDocument> {
  initialValues: T;
  fields: DataEntrySchema[];
  categoricalAttributes: Record<string, string[]>;
  editors: IEditor[];
  formClass: string;
  onCanSubmit: (v: boolean) => void;
  validationSchema: ObjectSchema<Record<keyof T, AnySchema>>;
  onSubmit: ((value: T) => void) | ((value: T) => Promise<void>);
  children?: ReactNode;
}

export const KalilaForm = <T extends KalilaDocument>({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  onCanSubmit,
  categoricalAttributes,
  editors,
  formClass,
  children,
}: IKalilaFormProps<T>) => {
  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit,
  });

  useEffect(() => {
    onCanSubmit(formik.isValid && Object.values(formik.touched).length !== 0);
  }, [formik.isValid, Object.values(formik.touched).length]);

  const formFields = fields.map((f) =>
    createFormField(f, categoricalAttributes, editors, formik)
  );

  return (
    <form
      className={formClass}
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      {formFields}
      {children}
    </form>
  );
};

function createFormField(
  field: DataEntrySchema,
  categoricalAttributes: Record<string, string[]>,
  editors: IEditor[],
  { errors, handleChange, handleBlur, setFieldValue, values }: any
): JSX.Element {
  const formControlProps = {
    key: `${field.FieldNamePascalCase}_key`,
    sx: { m: '1rem', width: '100%', typography: 'body1' },
    error: errors[field.FieldNamePascalCase] !== undefined,
  };
  const labelId = `${field.FieldNamePascalCase}-label`;
  const commonInputProps = {
    name: field.FieldNamePascalCase,
    label: field.FieldDisplay,
    onBlur: handleBlur,
  };
  const textInputProps = {
    ...commonInputProps,
    value: values[field.FieldNamePascalCase],
    onChange: handleChange,
  };

  const editorOptions: any[] = editors.map((v) => ({
    key: v.username,
    text: v.name,
  }));

  const selectFieldOptions: { key: any; text: any }[] =
    field.FieldNamePascalCase === 'Editor'
      ? editorOptions
      : field.FieldNamePascalCase === 'EditionProgress'
      ? editionProgressOptions.map((v) => ({ key: v, text: v }))
      : categoricalAttributes[field.CategoricalAttributeType ?? '___']?.map(
          (v: string) => ({
            key: v.replace(/\s/g, ''),
            text: v,
          })
        ) ?? [];
  const selectFieldProps = {
    ...commonInputProps,
    labelId,
    value: values[field.FieldNamePascalCase],
    onChange: (event: SelectChangeEvent) => {
      setFieldValue(field.FieldNamePascalCase, event.target.value);
    },
  };

  const inputLabel = (
    <InputLabel id={labelId}>{field.FieldNamePascalCase}</InputLabel>
  );
  const helperText = (
    <FormHelperText sx={{ height: '.8rem' }}>
      {errors[field.FieldNamePascalCase] ?? '  '}
    </FormHelperText>
  );
  switch (field.InputMode) {
    case InputModes.InputOne:
      if (field.KalilaValueType === KalilaValueTypes.String) {
        return (
          <FormControl {...formControlProps}>
            {inputLabel}
            <OutlinedInput {...textInputProps} />
            {helperText}
          </FormControl>
        );
      }
      break;
    case InputModes.InputMultiple:
      break;
    case InputModes.Boolean:
      break;
    case InputModes.SelectOne:
      return (
        <FormControl {...formControlProps}>
          {inputLabel}
          <Select {...selectFieldProps}>
            {selectFieldOptions.map(({ key, text }, i) => (
              <MenuItem key={i} value={key}>
                {text}
              </MenuItem>
            ))}
          </Select>
          {helperText}
        </FormControl>
      );
    case InputModes.SelectOrCreateOne:
      break;
    case InputModes.SelectMultiple:
      break;
    case InputModes.SelectOrCreateMultiple:
      break;
    case InputModes.ImageField:
      break;
    case InputModes.FileField:
      break;
    case InputModes.RichText:
      break;
    case InputModes.Table:
      break;
    case InputModes.Date:
      break;
    case InputModes.AudioField:
      break;
    case InputModes.VideoField:
      break;
    case InputModes.ExternalCreation:
      break;
    case InputModes.Administrative:
      break;
  }
  return <h2>Input mode not configured for {field.FieldName}</h2>;
}
