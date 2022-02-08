import { AnySchema } from 'yup/lib/schema';
import * as Yup from 'yup';
import { KalilaDocument } from './kalila-document';
import { adminPropValidation } from '../helpers';

type validatableProps = keyof Omit<
  ManuscriptDescriptionAdmin,
  'validationSchemaFactory' | 'CreateAdminUpdate' | 'CommonAdminUpdate'
>;

export class ManuscriptDescriptionAdmin extends KalilaDocument {
  constructor(
    public Id: string | undefined = undefined,
    public Siglum: string = '',
    public Editor: string = '',
    public EditionProgress: string = 'not started',
    public CreatedAt: Date | undefined = undefined,
    public Version: Date | undefined = undefined
  ) {
    super();
  }

  public validationSchemaFactory(
    editors: string[],
    validators: Record<string, (value: any) => Promise<boolean>>
  ) {
    return (config: {
      mode?: 'edit' | 'create';
      skip: Record<any, string[]>;
    }) => {
      let shape: Record<validatableProps, AnySchema>;
      switch (config.mode) {
        case 'edit':
          shape = {
            Siglum: Yup.string().test(
              'checkDuplication',
              'same siglum exists',
              async (value: string) => {
                if (config.skip.Siglum && config.skip.Siglum.includes(value)) {
                  return true;
                }
                return await validators['Siglum'](value);
              }
            ),
            ...adminPropValidation(editors),
          };
          break;
        case 'create':
        default:
          shape = {
            Siglum: Yup.string()
              .required('siglum is required')
              .test(
                'checkDuplication',
                'same siglum exists',
                async (value: string) => {
                  if (
                    config.skip.Siglum &&
                    config.skip.Siglum.includes(value)
                  ) {
                    return true;
                  }
                  return await validators['Siglum'](value);
                }
              ),
            ...adminPropValidation(editors),
          };
          break;
      }
      return Yup.object().shape(shape);
    };
  }

  public CreateAdminUpdate(oldValue: ManuscriptDescriptionAdmin, mode) {
    if (mode === 'one' && this.Siglum !== oldValue.Siglum) {
      return {
        Siglum: this.Siglum,
        OldSiglum: oldValue.Siglum,
        Editor: this.Editor,
        EditionProgress: this.EditionProgress,
      };
    }
    return this.CommonAdminUpdate();
  }
}
