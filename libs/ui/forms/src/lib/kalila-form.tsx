import {DataEntrySchema, InputModes, KalilaValueTypes} from "@frontend/util";
import {AnySchema} from "yup/lib/schema";
import {ObjectSchema} from "yup";
import {useFormik} from "formik";
import {Dropdown, IDropdownOption, TextField} from "@fluentui/react";
import React, {ReactNode, useEffect} from "react";
import {IEditor} from "@frontend/shared-ui";


export interface IKalilaFormProps<T extends object> {
  initialValues: T,
  fields: DataEntrySchema[],
  categoricalAttributes: Record<string, string[]>,
  editors: IEditor[],
  formClass: string,
  onCanSubmit: (v: boolean) => void,
  validationSchema: ObjectSchema<Record<keyof T, AnySchema>>,
  onSubmit: ((value: T) => void) | ((value: T) => Promise<void>)
  children?: ReactNode,
}

export const KalilaForm = <T extends object>(
  {
    initialValues,
    validationSchema,
    onSubmit,
    fields,
    onCanSubmit,
    categoricalAttributes,
    editors,
    formClass,
    children
  }: IKalilaFormProps<T>) => {

  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit
  });

  useEffect(() => {
    onCanSubmit(formik.isValid)
  }, [formik.isValid])

  const formFields = fields.map(f => createFormField(f, categoricalAttributes, editors, formik))

  return (
    <form className={formClass}
          autoComplete='off'
          onSubmit={formik.handleSubmit}>
      {formFields}
      {children}
    </form>
  )
}

function createFormField(field: DataEntrySchema, categoricalAttributes: Record<string, string[]>, editors: IEditor[], {
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
  values
}: any): JSX.Element {
  const commonProps = {
    key: field.FieldNamePascalCase,
    name: field.FieldNamePascalCase,
    label: `${field.FieldDisplay}:`,
    errorMessage: errors[field.FieldNamePascalCase],
    onBlur: handleBlur
  }
  const inputFieldProps = {
    ...commonProps,
    value: values[field.FieldNamePascalCase],
    onChange: handleChange,
  }

  const options: IDropdownOption[] = categoricalAttributes[field.CategoricalAttributeType ?? '___']?.map((v: string) => ({
    key: v.replace(/\s/g, ''),
    text: v
  })) ?? [];
  const editorOptions: IDropdownOption[] = editors.map(v => ({key: v.username, text: v.name}))
  const selectFieldProps = {
    ...commonProps,
    placeholder: field.FieldName,
    options: field.FieldNamePascalCase === 'Editor' ? editorOptions : options,
    selectedKey: values[field.FieldNamePascalCase],
    onChange: (_: any, option: any) => {
      setFieldValue(field.FieldNamePascalCase, option!.key)
    },
  }

  switch (field.InputMode) {
    case InputModes.InputOne:
      if (field.KalilaValueType === KalilaValueTypes.String) {
        return <TextField  {...inputFieldProps} />;
      }
      break;
    case InputModes.InputMultiple:
      break;
    case InputModes.Boolean:
      break;
    case InputModes.SelectOne:
      return <Dropdown {...selectFieldProps} />
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
  return <h2>Input mode not configured for {field.FieldName}</h2>
}
