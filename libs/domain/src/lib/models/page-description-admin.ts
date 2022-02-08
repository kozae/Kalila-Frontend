import { KalilaDocument } from './kalila-document';
import { AnySchema } from 'yup/lib/schema';
import * as Yup from 'yup';
import { adminPropValidation } from '../helpers';

type validatableProps = keyof Omit<
  PageDescriptionAdmin,
  'validationSchemaFactory' | 'CreateAdminUpdate' | 'CommonAdminUpdate'
>;

export class PageDescriptionAdmin extends KalilaDocument {
  constructor(
    public Id: string | undefined = undefined,
    public Number: number = 0,
    public Editor: string = '',
    public EditionProgress: string = 'not started',
    public CreatedAt: Date | undefined = undefined,
    public Version: Date | undefined = undefined
  ) {
    super();
  }

  CreateAdminUpdate(
    oldValue: PageDescriptionAdmin,
    mode: 'one' | 'many' | 'filtered'
  ): any {
    if (mode === 'one' && this.Number !== oldValue.Number) {
      return {
        Number: this.Number,
        Editor: this.Editor,
        EditionProgress: this.EditionProgress,
      };
    }

    return this.CommonAdminUpdate();
  }

  validationSchemaFactory(
    editors: string[],
    validators: Record<any, (value: any) => Promise<boolean>>
  ) {
    return (config: { mode?: 'edit' | 'create'; skip: Record<any, any[]> }) => {
      let shape: Record<validatableProps, AnySchema>;
      switch (config.mode) {
        case 'edit':
          shape = {
            Number: Yup.number()
              .integer('page number must be an integer')
              .test(
                'positive',
                'page number cannot be negative',
                (v: number) => v >= 0
              )
              .test(
                'checkDuplication',
                'same number exists',
                async (value: number) => {
                  if (
                    config.skip.Number &&
                    config.skip.Number.includes(value)
                  ) {
                    return true;
                  }
                  return await validators['Number'](value);
                }
              ),
            ...adminPropValidation(editors),
          };
          break;
        case 'create':
        default:
          shape = {
            Number: Yup.number()
              .integer('page number must be an integer')
              .test(
                'positive',
                'page number cannot be negative',
                (v: number) => v >= 0
              )
              .required('you must enter a page number')
              .test(
                'checkDuplication',
                'same number exists',
                async (value: number) => {
                  if (
                    config.skip.Number &&
                    config.skip.Number.includes(value)
                  ) {
                    return true;
                  }
                  return await validators['Number'](value);
                }
              ),
            ...adminPropValidation(editors),
          };
          break;
      }
      return Yup.object().shape(shape);
    };
  }
}
