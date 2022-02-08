import { DataEntrySchema, InputModes, KalilaValueTypes } from '@frontend/util';
import { IEditor } from '@frontend/shared-ui';
import React from 'react';
import {
  ICommonFieldProps,
  InputOneInteger,
  InputOneString,
  SelectOne,
} from './fields';
import { useCommonFieldProps } from './create-form-field.hooks';

export function createFormField(
  field: DataEntrySchema,
  categoricalAttributes: Record<string, string[]>,
  editors: IEditor[],
  { errors, handleChange, handleBlur, setFieldValue, values }: any
): JSX.Element {
  const labelId = `${field.FieldNamePascalCase}-label`;
  const commonProps: ICommonFieldProps = useCommonFieldProps(
    field,
    errors,
    handleBlur,
    labelId,
    values
  );
  let props: any;
  switch (field.InputMode) {
    case InputModes.InputOne:
      props = {
        key: labelId,
        handleChange,
        ...commonProps,
      };
      if (field.KalilaValueType === KalilaValueTypes.String) {
        return <InputOneString {...props} />;
      }
      if (field.KalilaValueType === KalilaValueTypes.Int) {
        return <InputOneInteger {...props} />;
      }
      break;
    case InputModes.InputMultiple:
      break;
    case InputModes.Boolean:
      break;
    case InputModes.SelectOne:
      props = {
        key: labelId,
        field,
        setFieldValue,
        categoricalAttributes,
        labelId,
        editors,
        ...commonProps,
      };
      return <SelectOne {...props} />;
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
  return <h3 key={labelId}>Input mode not configured for {field.FieldName}</h3>;
}
