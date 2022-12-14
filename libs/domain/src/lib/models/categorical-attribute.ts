import { KalilaDocument, validationWithParentFn } from './kalila-document';
import { AnySchema } from 'yup/lib/schema';
import * as Yup from 'yup';
import axios from 'axios';

export enum KalilaRelationType {
  LookupId,
  LookupEmbeddedId,
  LookupKeyValue,
}

export enum KalilaValueTypes {
  String,
  Int,
  Float,
  Boolean,
  StringList,
  IntList,
  FloatList,
  Entity,
  EntityNumericalRelation,
  CategoricalAttribute,
  EntityList,
  EmbeddedEntityList,
  CategoricalAttributeList,
  Date, // Only used for versioning
}

interface IDataEntrySchema {
  DocumentName: string;
  FieldGroup?: string;
  FieldCategory?: string;
  FieldName: string;
  FieldDisplay: string;
  FieldNamePascalCase: string;
  FieldDescription?: string;
  Readonly?: boolean;
  Hidden?: boolean;
  Unique?: boolean;
  KeyField?: boolean;
  TopField?: boolean;
  Searchable?: boolean;
  EditableInBulk?: boolean;
  KalilaValueType: KalilaValueTypes;
  RelationType?: KalilaRelationType;
  ValueProperties?: string[];
  ConnectsToEntity?: string;
  ConnectsToField?: string;
  InputMode: InputModes;
  CategoricalAttributeType?: string;
}

interface ActivitySchema {
  Fields: IDataEntrySchema[];
  CategoricalAttributes: Record<string, any[]>;
}

enum InputModes {
  InputOne,
  InputMultiple,
  Boolean,
  SelectOne,
  SelectOrCreateOne,
  SelectMultiple,
  SelectOrCreateMultiple,
  ImageField,
  FileField,
  RichText,
  Table,
  Date,
  AudioField,
  VideoField,
  ExternalCreation,
  Administrative,
}

export interface ICategoricalAttribute {
  Id: string;
  EntityName: string;
  FieldName: string;
  Option: string;
}

export class CategoricalAttribute
  extends KalilaDocument
  implements ICategoricalAttribute
{
  constructor(
    public Id: string | undefined = undefined,
    public EntityName: string = '',
    public FieldName: string = '',
    public Option: string = ''
  ) {
    super();
  }

  public async CreateAdminUpdate(
    { EntityName, FieldName, Option }: any,
    mode: 'one' | 'many' | 'filtered' = 'one'
  ) {
    const { data: entitySchema } = await axios.get<ActivitySchema>(
      `/server/api/v1/EntrySchema/${EntityName}`,
      {
        headers: {
          Accept: 'application/json',
        },
        params: {
          CategoricalAttributeType: FieldName,
        },
      }
    );
    return {
      EntityName,
      FieldName,
      OldValue: Option,
      NewValue: this.Option,
      IsArray: entitySchema.Fields[0].InputMode === InputModes.SelectMultiple,
    };
  }

  validationSchemaFactory(
    editors: string[],
    validators: Record<'Option', validationWithParentFn>
  ) {
    return (config: {
      mode?: 'edit' | 'create';
      skip: Record<any, string[]>;
    }) => {
      let shape: Record<'EntityName' | 'FieldName' | 'Option', AnySchema>;
      switch (config.mode) {
        case 'edit':
          shape = {
            EntityName: Yup.string(),
            FieldName: Yup.string(),
            Option: Yup.string().test(
              'checkDuplication',
              'same option exists',
              async (value, ctx) => {
                if (config.skip.Option && config.skip.Option.includes(value)) {
                  return true;
                }
                return await validators['Option'](value, ctx.parent);
              }
            ),
          };
          break;
        case 'create':
        default:
          shape = {
            EntityName: Yup.string().required(),
            FieldName: Yup.string().required(),
            Option: Yup.string()
              .required()
              .test('checkDuplication', 'same option exists', (value, ctx) =>
                validators['Option'](value, ctx.parent)
              ),
          };
          break;
      }
      return Yup.object().shape(shape);
    };
  }
}
