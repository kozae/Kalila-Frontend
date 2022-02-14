import React from 'react';
import { Column, useTable } from 'react-table';
import Paper from '@mui/material/Paper';
import styles from './grid.module.scss';
import { IFilterProps, ISortControlProps } from './column-controls';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { isOdd } from '@frontend/util';

export interface IGridProps<T extends object> {
  loading: boolean;
  columns: ReadonlyArray<Column<T>>;
  data: readonly T[];
  height?: string;
  headerProps: ISortControlProps & IFilterProps;
}

export const Grid = <T extends object>({
  loading,
  data,
  columns,
  height,
  headerProps,
}: IGridProps<T>) => {
  const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: height ?? 'calc(100vh - 185px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={180} />
        </Box>
      )}
      <Paper
        sx={{
          maxWidth: '100%',
          overflow: 'scroll',
          height: 'fit-content',
          maxHeight: height ?? 'calc(100vh - 185px)',
        }}
      >
        <table className={styles['table']} {...getTableProps()}>
          <thead className={styles['header']}>
            {headerGroups.map((headerGroup) => (
              <tr
                className={styles['header-row']}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column: any) => (
                  <th
                    style={{ backgroundColor: column.color }}
                    className={styles['header-cell']}
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header', { ...headerProps, f: column.f })}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr className={styles['row']} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td className={styles['cell']} {...cell.getCellProps()}>
                        {cell.render('Cell', { odd: isOdd(i) })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};
