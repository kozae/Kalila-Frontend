import { IDataEntrySchema, InputModes, KalilaValueTypes } from '@frontend/util';

export const entrySchema: IDataEntrySchema[] = [
  {
    DocumentName: 'ImageElement',
    FieldName: 'motifs',
    FieldDisplay: 'Motifs',
    FieldNamePascalCase: 'Motifs',
    KalilaValueType: KalilaValueTypes.CategoricalAttributeList,
    InputMode: InputModes.SelectMultiple,
    CategoricalAttributeType: 'Motifs',
  },
  {
    DocumentName: 'ImageElement',
    FieldName: 'style elements',
    FieldDisplay: 'Style Elements',
    FieldNamePascalCase: 'StyleElements',
    KalilaValueType: KalilaValueTypes.CategoricalAttributeList,
    InputMode: InputModes.SelectMultiple,
    CategoricalAttributeType: 'StyleElements',
  },
];
