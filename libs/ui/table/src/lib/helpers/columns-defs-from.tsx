import React from 'react';
import { Column } from 'react-table';
import { ITableSchema } from './table-schema';
import { ColumnGroupHeader } from '../headers';
import { isOdd, KalilaValueTypes } from '@frontend/util';
import { GrayHeader, PrimaryGreenHeader, WhiteHeader } from '../headers';
import { CellSelector } from '../cells';
import { getSelectionColumn } from './get-selection-column';
import { KeyValueCell } from '../cells/key-value-cell';
import { EditorCell } from '../cells/editor-cell';

export const columnsDefsFrom = (
  tableSchema: ITableSchema | null,
  selection: Set<string>,
  setSelection: (Ids: Set<string>) => void,
  excludedColumns: Set<string> = new Set<string>()
): ReadonlyArray<Column<any>> => {
  if (tableSchema === null) return [];

  const columns: Column<any>[] = [
    getSelectionColumn<any>(selection, setSelection),
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
      columns: fields
        .filter((f) => !excludedColumns.has(f.FieldNamePascalCase))
        .map((f) => ({
          Header: isOdd(i) ? GrayHeader : WhiteHeader,
          accessor: f.FieldNamePascalCase,
          color: isOdd(i) ? '#666666' : 'white',
          Cell: CellSelector,
          f,
        })),
    }))
  );

  columns.push(
    ...tableSchema.fields
      .filter((f) => !excludedColumns.has(f.FieldNamePascalCase))
      .map((f, i) => ({
        Header: isOdd(i) ? GrayHeader : WhiteHeader,
        accessor: f.FieldNamePascalCase,
        color: isOdd(i) ? '#666666' : 'white',
        Cell: CellSelector,
        f,
      }))
  );
  return columns;
};
