import useSWRImmutable from 'swr/immutable';
import {
  ActivitySchema,
  DataEntrySchema,
  fetcher,
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
      if (Object.keys(schemaFilter).length !== 0) {
        const topField = schema.data.content.Fields.find(
          (f: DataEntrySchema) => f.TopField
        ) as DataEntrySchema;
        const fields = schema.data.content.Fields.filter(
          (f: DataEntrySchema) => f.FieldGroup === schemaFilter.FieldGroup
        );
        return {
          Fields: [topField, ...fields],
          CategoricalAttributes: schema.data.content.CategoricalAttributes,
        };
      }
    }
    return schema.data?.content;
  }, [schema.data?.content, schemaFilter]);
}
