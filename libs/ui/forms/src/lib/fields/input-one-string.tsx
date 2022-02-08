import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
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
      <OutlinedInput {...textInputProps} />
      {helperText}
    </FormControl>
  );
};
