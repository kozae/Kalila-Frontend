import {AnySchema} from "yup/lib/schema";
import * as Yup from 'yup'
import {editionProgressOptions} from "@frontend/util";
import {KalilaDocument} from "./kalila-document";

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

  public validationSchemaFactory(editors: string[], validators: Record<string, (value: any) => Promise<boolean>>) {
    return (config: {mode?: 'edit' | 'create'  ,skip: Record<any, string[]> }) => {
      let shape: Record<keyof Omit<ManuscriptDescriptionAdmin, 'validationSchemaFactory' | 'CreateAdminUpdate'>, AnySchema>;
      switch (config.mode) {
        case "edit":
          shape = {
            Id: Yup.string().nullable(),
            Siglum: Yup.string().test('checkDuplication', 'same siglum exists', async (value: string) => {
              if (config.skip.Siglum && config.skip.Siglum.includes(value)) {
                return true
              }
              return await validators['Siglum'](value)
            }),
            Editor: Yup.string().oneOf(editors, 'you must select an existing editor'),
            EditionProgress: Yup.string().oneOf(editionProgressOptions),
            CreatedAt: Yup.date().nullable(),
            Version: Yup.date().nullable()
          }
          break;
        case "create":
        default:
          shape = {
            Id: Yup.string().nullable(),
            Siglum: Yup.string().required('siglum is required').test('checkDuplication', 'same siglum exists', async (value: string) => {
              if (config.skip.Siglum && config.skip.Siglum.includes(value)) {
                return true
              }
              return await validators['Siglum'](value)
            }),
            Editor: Yup.string().oneOf(editors, 'you must select an existing editor').required('editor is required'),
            EditionProgress: Yup.string().oneOf(editionProgressOptions),
            CreatedAt: Yup.date().nullable(),
            Version: Yup.date().nullable()
          }
          break;
      }
      return Yup.object().shape(shape)
    }
  }

  public CreateAdminUpdate(oldValue: ManuscriptDescriptionAdmin, mode) {
    switch (mode) {
      case "one":
        if (this.Siglum !== oldValue.Siglum) {
          return {
            Siglum: this.Siglum,
            OldSiglum: oldValue.Siglum,
            Editor: this.Editor,
            EditionProgress: this.EditionProgress
          }
        } else {
          return {
            Editor: this.Editor,
            EditionProgress: this.EditionProgress
          }
        }
      case "many":
      case "filtered":
        return {
          Editor: this.Editor,
          EditionProgress: this.EditionProgress
        }

    }
  }

}

