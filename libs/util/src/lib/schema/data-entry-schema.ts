import { InputModes } from './input-modes';
import { KalilaValueTypes } from './value-type';
import { KalilaRelationType } from './relation-type';

export interface DataEntrySchema {
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
  CategoricalAttributeType: string;
}
