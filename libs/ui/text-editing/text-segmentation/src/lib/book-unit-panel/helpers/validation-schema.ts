import * as Yup from 'yup';

export const BookUnitValidation = Yup.object().shape({
  Title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  Order: Yup.array().of(Yup.number().required()).min(1).required(),
});
