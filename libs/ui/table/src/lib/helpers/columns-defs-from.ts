import { DataEntrySchema } from '@frontend/util';

export const columnsDefsFrom = (
  fields: DataEntrySchema[],
  headerComponentParams: any
): Array<any> => {
  const columns: Array<any> = [];

  return fields.map((f) => ({
    field: f.FieldNamePascalCase,
    headerName: f.FieldDisplay,
    suppressSizeToFit: true,
    headerComponent: 'stringValueHeader',
    headerComponentParams,
    minWidth: 300,
    resizable: false,
    suppressMovable: true,
  }));
};
