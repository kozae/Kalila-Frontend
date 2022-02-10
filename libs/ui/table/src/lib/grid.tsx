import React from 'react';
import { Column, useTable } from 'react-table';
import Paper from '@mui/material/Paper';
import styles from './grid.module.scss';
import LazyLoad from 'react-lazyload';

export interface IGridProps<T extends object> {
  loading: boolean;
  columns: ReadonlyArray<Column<T>>;
  data: readonly T[];
}

export const Grid = <T extends object>({
  loading,
  data,
  columns,
}: IGridProps<T>) => {
  const {
    totalColumnsWidth,
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
  return (
    <Paper
      sx={{
        maxWidth: '100%',
        overflow: 'scroll',
        height: 'calc(100vh - 185px)',
      }}
    >
      <table className={styles['table']} {...getTableProps()}>
        <LazyLoad>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                className={styles['header']}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    className={styles['header__cell']}
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </LazyLoad>
      </table>
    </Paper>
  );
};
