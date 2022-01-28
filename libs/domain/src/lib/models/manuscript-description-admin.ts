import {AnySchema} from "yup/lib/schema";
import * as Yup from 'yup'
import axios from "axios";
import {editionProgressOptions} from "@frontend/util";

export class ManuscriptDescriptionAdmin {
  constructor(
    public Id: string | undefined = undefined,
    public Siglum: string = '',
    public Editor: string = '',
    public EditionProgress: string = 'not started',
    public CreatedAt: Date | undefined = undefined,
    public Version: Date | undefined = undefined
  ) {
  }

  static getValidationSchema(editors: string[]) {
    const shape: Record<keyof ManuscriptDescriptionAdmin, AnySchema> = {
      Id: Yup.string().nullable(),
      Siglum: Yup.string().required('siglum is required')
      //   .test('checkDuplication', 'same siglum exists', function (value) {
      //   return axios.get<boolean>('/server/api/v1/ManuscriptDescription/Check', {
      //     params: {
      //       SiglumSw: value,
      //       SiglumEw: value,
      //     }
      //   }).then(r => !r.data)
      // })
      ,
      Editor: Yup.string().oneOf(editors, 'you must select an existing editor').required('editor is required'),
      EditionProgress: Yup.string().oneOf(editionProgressOptions),
      CreatedAt: Yup.date().nullable(),
      Version: Yup.date().nullable()
    }

    return Yup.object().shape(shape)
  }
}

