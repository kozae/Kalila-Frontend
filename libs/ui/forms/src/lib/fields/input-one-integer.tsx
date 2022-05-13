import FormControl from '@mui/material/FormControl';
import React from 'react';
import { ICommonFieldProps } from './common-field-props';
import { filterNonInteger } from '../helpers';
import { Input } from '@mui/material';

interface IInputOneIntegerProps extends ICommonFieldProps {
  handleChange: any;
}

export const InputOneInteger = ({
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
    onChange: (e: any) => filterNonInteger(e, handleChange),
  };
  return (
    <FormControl {...formControlProps}>
      {inputLabel}
      <Input {...integerInputProps} />
      {helperText}
    </FormControl>
  );
};
