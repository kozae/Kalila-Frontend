import { DataEntrySchema } from '@frontend/util';
import { AnySchema } from 'yup/lib/schema';
import { ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import React, { ReactNode, useEffect } from 'react';
import { IEditor } from '@frontend/shared-ui';
import { KalilaDocument } from '@frontend/domain';
import { createFormField } from './create-form-field';

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
