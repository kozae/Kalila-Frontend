import { IDataEntrySchema } from './data-entry-schema';

export function fieldsAsMap(
  fields: IDataEntrySchema[]
): Map<string, IDataEntrySchema> {
  const result = new Map<string, IDataEntrySchema>();
  for (let field of fields) {
    result[field.FieldNamePascalCase] = field;
  }

  return result;
}
