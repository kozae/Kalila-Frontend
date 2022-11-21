import * as Yup from 'yup';
import { editionProgressOptions } from '@frontend/util';

export function adminPropValidation(editors: string[]) {
  return {
    Id: Yup.string().nullable(),
    Editor: Yup.string().oneOf(editors, 'you must select an existing editor'),
    EditionProgress: Yup.string().oneOf(editionProgressOptions),
    CreatedAt: Yup.date().nullable(),
    Version: Yup.date().nullable(),
  };
}
