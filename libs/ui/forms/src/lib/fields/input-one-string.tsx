import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import React from 'react';
import { ICommonFieldProps } from './common-field-props';

interface IInputOneStringProps extends ICommonFieldProps {
  handleChange: any;
}

export const InputOneString = ({
  formControlProps,
  commonInputProps,
  value,
  handleChange,
  inputLabel,
  helperText,
}: IInputOneStringProps) => {
  const textInputProps = {
    ...commonInputProps,
    value,
    onChange: handleChange,
  };
  return (
    <FormControl {...formControlProps}>
      {inputLabel}
      <Input {...textInputProps} />
      {helperText}
    </FormControl>
  );
};
