import {
  ActivitySchema,
  DataEntrySchema,
  stringHasValue,
} from '@frontend/util';
import * as lodash from 'lodash';
import { fetchSchema } from '@frontend/shared-ui';
import { useMemo } from 'react';

export interface ITableSchema {
  topField: DataEntrySchema;
  categories: Record<string, DataEntrySchema[]>;
  fields: DataEntrySchema[];
}

export function getTableSchema(fields: DataEntrySchema[]): ITableSchema {
  const topField = fields.find((f) => f.TopField) as DataEntrySchema;
  const categories = lodash.groupBy(
    fields.filter((f) => !f.TopField && stringHasValue(f.FieldCategory)),
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

export function useTableSchema(schema: ActivitySchema) {
  return useMemo(
    () => (schema ? getTableSchema(schema?.Fields) : null),
    [schema]
  );
}
