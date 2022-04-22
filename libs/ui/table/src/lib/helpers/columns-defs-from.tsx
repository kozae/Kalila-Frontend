import React from 'react';
import { ITableSchema } from './table-schema';
import { ColumnGroupHeader } from '../headers';
import { isOdd, KalilaValueTypes } from '@frontend/util';
import { GrayHeader, PrimaryGreenHeader, WhiteHeader } from '../headers';
import { CellSelector, EditorCell, KeyValueCell } from '../cells';

export const columnsDefsFrom = (
  tableSchema: ITableSchema | null
): ReadonlyArray<any> => {
  if (tableSchema === null) return [];

  const columns: any[] = [
    {
      Header: () => (
        <ColumnGroupHeader bgcolor="primary.main" color="white" text="" />
      ),
      accessor: tableSchema.topField.FieldNamePascalCase,
      columns: [
        {
          Header: PrimaryGreenHeader,
          accessor: tableSchema.topField.FieldNamePascalCase,
          Cell: KeyValueCell,
          //@ts-ignore
          f: tableSchema.topField,
        },
        {
          Header: PrimaryGreenHeader,
          accessor: 'Editor',
          id: '_editor',
          Cell: EditorCell,
          //@ts-ignore
          f: {
            FieldDisplay: 'Editor',
            FieldNamePascalCase: 'Editor',
            KalilaValueType: KalilaValueTypes.String,
          },
        },
      ],
    },
  ];
  columns.push(
    ...Object.entries(tableSchema.categories).map(([cat, fields], i) => ({
      Header: () => (
        <ColumnGroupHeader
          bgcolor={isOdd(i) ? '#666666' : 'white'}
          color={isOdd(i) ? 'white' : 'black'}
          text={cat}
        />
      ),
      accessor: cat,
      color: isOdd(i) ? '#666666' : 'white',
      columns: fields.map((f) => ({
        Header: isOdd(i) ? GrayHeader : WhiteHeader,
        accessor: f.FieldNamePascalCase,
        color: isOdd(i) ? '#666666' : 'white',
        Cell: CellSelector,
        f,
      })),
    }))
  );

  columns.push(
    ...tableSchema.fields.map((f, i) => ({
      Header: isOdd(i) ? GrayHeader : WhiteHeader,
      accessor: f.FieldNamePascalCase,
      color: isOdd(i) ? '#666666' : 'white',
      Cell: CellSelector,
      f,
    }))
  );
  return columns;
};
