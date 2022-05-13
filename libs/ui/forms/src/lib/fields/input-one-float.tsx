import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import React from 'react';
import { ICommonFieldProps } from './common-field-props';
import { filterNonFloat } from '../helpers';

interface IInputOneIntegerProps extends ICommonFieldProps {
  handleChange: any;
}

export const InputOneFloat = ({
  formControlProps,
  commonInputProps,
  value,
  handleChange,
  inputLabel,
  helperText,
}: IInputOneIntegerProps) => {
  const integerInputProps = {
    ...commonInputProps,
    value,
    onChange: (e: any) => filterNonFloat(e, handleChange),
  };
  return (
    <FormControl {...formControlProps}>
      {inputLabel}
      <Input {...integerInputProps} />
      {helperText}
    </FormControl>
  );
};
