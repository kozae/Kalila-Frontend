import {
  KalilaDocument,
  validationFn,
  validationWithParentFn,
} from './kalila-document';
import { AnySchema } from 'yup/lib/schema';
import * as Yup from 'yup';
import { adminPropValidation } from '../helpers';
import { ManuscriptDescriptionAdmin } from './manuscript-description-admin';
import { ObjectSchema } from 'yup';

type validatableProps = keyof Omit<
  BookUnit,
  'validationSchemaFactory' | 'CreateAdminUpdate' | 'CommonAdminUpdate'
>;

export class BookUnit extends KalilaDocument {
  constructor(
    public Id: string | undefined = undefined,
    public Chapter: string | undefined = undefined,
    public OrderInChapter: number | undefined = 0,
    public Title: string | undefined = '',
    public Editor: string = '',
    public EditionProgress: string = 'in work',
    public CreatedAt: Date | undefined = undefined,
    public Version: Date | undefined = undefined
  ) {
    super();
  }

  CreateAdminUpdate(
    oldValue: any,
    mode: 'one' | 'many' | 'filtered'
  ): Promise<any> {
    return Promise.resolve(undefined);
  }

  validationSchemaFactory(
    editors: string[],
    validators: Record<any, validationFn>
  ) {
    return (config: {
      mode?: 'edit' | 'create';
      skip: Record<any, any[]>;
    }): ObjectSchema<Record<validatableProps, AnySchema>> => {
      let shape: Record<validatableProps, AnySchema>;
      switch (config.mode) {
        case 'edit':
          shape = {
            Title: Yup.string()
              .test(
                'checkConvention',
                'Unit title must start with the chapter abbreviation',
                (value, ctx) => {
                  return value && value.startsWith(ctx.parent.Chapter);
                }
              )
              .test(
                'checkDuplication',
                'same title exists',
                async (value: string) => {
                  if (
                    config.skip.Title &&
                    (config.skip.Title.length === 0 ||
                      config.skip.Title.includes(value))
                  ) {
                    return true;
                  }
                  return await validators['Title'](value);
                }
              ),
            Chapter: Yup.string().test(
              'checkExistence',
              'chapter does not exist',
              async (value: string) => {
                if (
                  config.skip.Chapter &&
                  (config.skip.Chapter.length === 0 ||
                    config.skip.Chapter.includes(value))
                ) {
                  return true;
                }
                return await validators['Chapter'](value);
              }
            ),
            OrderInChapter: Yup.number().test(
              'checkDuplication',
              'same number is assigned to another unit',
              async (value: number) => {
                if (
                  config.skip.OrderInChapter !== undefined &&
                  (config.skip.OrderInChapter.length === 0 ||
                    config.skip.OrderInChapter.includes(value))
                ) {
                  return true;
                }
                return await validators['OrderInChapter'](value);
              }
            ),
            ...adminPropValidation(editors),
          };
          break;
        case 'create':
          shape = {
            Title: Yup.string()
              .test(
                'checkConvention',
                'Unit title must start with the chapter abbreviation',
                (value, ctx) => {
                  return value && value.startsWith(ctx.parent.Chapter);
                }
              )
              .test(
                'checkDuplication',
                'same title exists',
                async (value: string) => {
                  if (
                    config.skip.Title &&
                    (config.skip.Title.length === 0 ||
                      config.skip.Title.includes(value))
                  ) {
                    return true;
                  }
                  return await validators['Title'](value);
                }
              ),
            Chapter: Yup.string().test(
              'checkExistence',
              'chapter does not exist',
              async (value: string) => {
                if (
                  config.skip.Chapter &&
                  (config.skip.Chapter.length === 0 ||
                    config.skip.Chapter.includes(value))
                ) {
                  return true;
                }
                return await validators['Chapter'](value);
              }
            ),
            OrderInChapter: Yup.number().test(
              'checkDuplication',
              'same number is assigned to another unit',
              async (value: number) => {
                if (
                  config.skip.OrderInChapter !== undefined &&
                  (config.skip.OrderInChapter.length === 0 ||
                    config.skip.OrderInChapter.includes(value))
                ) {
                  return true;
                }
                return await validators['OrderInChapter'](value);
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
