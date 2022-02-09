import React from 'react';
import { Column, useTable } from "react-table";

export interface IGridProps<T extends object> {
  loading: boolean;
  columns: ReadonlyArray<Column<T>>;
  data: readonly T[];
}

export const Grid = <T extends object>({ loading, data, columns }: IGridProps<T>) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns: [],
    data: [],
  });
  return <></>;
};
