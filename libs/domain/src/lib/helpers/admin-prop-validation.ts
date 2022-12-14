import * as Yup from 'yup';
const editionProgressOptions = [
  'not started',
  'in work',
  'needs revision',
  'finished'
]

export function adminPropValidation(editors: string[]) {
  return {
    Id: Yup.string().nullable(),
    Editor: Yup.string().oneOf(editors, 'you must select an existing editor'),
    EditionProgress: Yup.string().oneOf(editionProgressOptions),
    CreatedAt: Yup.date().nullable(),
    Version: Yup.date().nullable(),
  };
}
