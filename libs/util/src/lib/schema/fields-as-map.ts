import {DataEntrySchema} from "./data-entry-schema";

export function fieldsAsMap(fields: DataEntrySchema[]): Map<string, DataEntrySchema> {
  const result = new Map<string, DataEntrySchema>();
  for (let field of fields) {
    result[field.FieldNamePascalCase] = field
  }

  return result;
}
