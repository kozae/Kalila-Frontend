import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { IDataEntrySchema, editionProgressOptions } from '@frontend/util';
import { IEditor } from '@frontend/shared-ui';
import { ICommonFieldProps } from './common-field-props';

interface ISelectOneProps extends ICommonFieldProps {
  field: IDataEntrySchema;
  categoricalAttributes: Record<string, string[]>;
  editors: IEditor[];
  setFieldValue: any;
  labelId: string;
}

export const SelectOne = ({
  field,
  categoricalAttributes,
  editors,
  setFieldValue,
  labelId,
  formControlProps,
  commonInputProps,
  value,
  inputLabel,
  helperText,
}: ISelectOneProps) => {
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
  selectFieldOptions.push({ key: '[null]', text: '' });
  const selectFieldProps = {
    ...commonInputProps,
    labelId,
    value,
    onChange: (event: SelectChangeEvent) => {
      setFieldValue(field.FieldNamePascalCase, event.target.value);
    },
  };
  return (
    <FormControl {...formControlProps} variant="standard">
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
};
