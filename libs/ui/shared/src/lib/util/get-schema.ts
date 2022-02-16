import useSWRImmutable from 'swr/immutable';
import {
  ActivitySchema,
  DataEntrySchema,
  fetcher,
  InputModes,
  IPagination,
} from '@frontend/util';
import { SWRResponse } from 'swr';
import { useMemo } from 'react';

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
    [
      `EntrySchema/${transformSchemaName(activityName)}`,
      undefined, // no accessToken needed
      schemaFilter,
    ],
    fetcher
  );
}

export function getSchemaWithClientSideFilter(
  activityName: string,
  schemaFilter: any = {}
): ActivitySchema {
  const schema = useSWRImmutable(
    [
      `EntrySchema/${transformSchemaName(activityName)}`,
      undefined, // no accessToken needed
      {},
    ],
    fetcher
  );
  return useMemo(() => {
    if (schema.data?.content) {
      const topField = schema.data.content.Fields.find(
        (f: DataEntrySchema) => f.TopField
      ) as DataEntrySchema;
      if (Object.keys(schemaFilter).length !== 0) {
        const fields = schema.data.content.Fields.filter(
          (f: DataEntrySchema) =>
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
