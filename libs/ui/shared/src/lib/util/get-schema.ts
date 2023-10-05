/* eslint-disable react-hooks/rules-of-hooks */
import useSWRImmutable from 'swr/immutable';
import { ActivitySchema, IDataEntrySchema, IPagination } from '@frontend/util';
import { SWRResponse } from 'swr';
import { useMemo } from 'react';
import { fetcher } from './api-client';

export function transformSchemaName(activityName: string) {
  switch (activityName) {
    case 'PageDescription':
    case 'PageTranscription':
      return 'Page';
    default:
      return activityName;
  }
}

export function fetchSchema(
  activityName: string,
  schemaFilter: any = {}
): SWRResponse<
  { content: ActivitySchema; pagination: IPagination | undefined },
  any
> {
  return useSWRImmutable(
    [`EntrySchema/${transformSchemaName(activityName)}`, schemaFilter],
    (args) => fetcher(...args)
  );
}

export function getSchemaWithClientSideFilter(
  activityName: string,
  schemaFilter: any = {}
): ActivitySchema {
  const schema = useSWRImmutable(
    [
      `EntrySchema/${transformSchemaName(activityName)}`,
      schemaFilter,
      'application/json',
    ],
    (args) => fetcher(...args)
  );
  return useMemo(() => {
    if (schema.data?.content) {
      const topField = schema.data.content.Fields.find(
        (f: IDataEntrySchema) => f.TopField
      ) as IDataEntrySchema;
      if (Object.keys(schemaFilter).length !== 0) {
        const fields = schema.data.content.Fields.filter(
          (f: IDataEntrySchema) =>
            f.InputMode !== 15 && f.FieldGroup === schemaFilter.FieldGroup
        );
        return {
          Fields: [topField, ...fields.filter((f: any) => f.InputMode !== 15)],
          CategoricalAttributes: schema.data.content.CategoricalAttributes,
        };
      }
      return {
        Fields: [
          topField,
          ...schema.data.content.Fields.filter(
            (f: any) => !f.TopField && f.InputMode !== 15
          ),
        ],
        CategoricalAttributes: schema.data.content.CategoricalAttributes,
      };
    }
    return schema.data?.content;
  }, [schema.data?.content, schemaFilter]);
}
