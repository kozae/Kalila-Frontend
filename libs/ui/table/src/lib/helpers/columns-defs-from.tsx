import { DataEntrySchema } from '@frontend/util';
import { StringValueHeader } from '../headers';
import React from 'react';
import { Column } from 'react-table';
import Typography from '@mui/material/Typography';

export const columnsDefsFrom = (
  fields: DataEntrySchema[],
  headerComponentParams: any
): ReadonlyArray<Column<any>> => {
  return fields.map((f) => ({
    Header: () => (
      <StringValueHeader
        Id={f.FieldNamePascalCase}
        displayName={f.FieldDisplay}
        {...headerComponentParams}
      />
    ),
    accessor: f.FieldNamePascalCase,
    Cell: ({ value }: any) => (
      <Typography sx={{ width: '200px', pl: '.5rem' }} variant="body1">
        {String(value)}
      </Typography>
    ),
  }));
};
