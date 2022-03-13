import { IDataEntrySchema, stringHasValue } from '@frontend/util';
import * as lodash from 'lodash';
import { useMemo } from 'react';

export interface ITableSchema {
  topField: IDataEntrySchema;
  categories: Record<string, IDataEntrySchema[]>;
  fields: IDataEntrySchema[];
}

export function getTableSchema(
  fields: IDataEntrySchema[],
  excludedColumns: Set<string>
): ITableSchema {
  const topField = fields.find((f) => f.TopField) as IDataEntrySchema;
  const categories = lodash.groupBy(
    fields.filter(
      (f) =>
        !f.TopField &&
        stringHasValue(f.FieldCategory) &&
        !excludedColumns.has(f.FieldNamePascalCase)
    ),
    (f) => f.FieldCategory
  );
  return {
    topField,
    categories,
    fields: fields.filter(
      (f) => !f.TopField && !stringHasValue(f.FieldCategory)
    ),
  };
}

export function useTableSchema(
  fields: IDataEntrySchema[],
  excludedColumns: Set<string> = new Set<string>()
) {
  return useMemo(
    () => getTableSchema(fields, excludedColumns),
    [fields.length, excludedColumns]
  );
}
