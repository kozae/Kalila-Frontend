import './table.module.scss';
import React, {CSSProperties, ReactNode} from "react";
import {Column, useTable} from 'react-table'


export interface ITableProps<T extends object> {
  data: T[],
  columns: Column<T>[],
  tableStyles: Record<'table' | 'thead', CSSProperties>
}


export const Table = <T extends object>({data, columns, tableStyles}: ITableProps<T> & { children?: ReactNode }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data})
  return (
    <table {...getTableProps()} style={tableStyles['table']}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th
              {...column.getHeaderProps()}
              style={{
                borderBottom: 'solid 3px red',
                background: 'aliceblue',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return (
                <td
                  {...cell.getCellProps()}
                  style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papayawhip',
                  }}
                >
                  {cell.render('Cell')}
                </td>
              )
            })}
          </tr>
        )
      })}
      </tbody>
    </table>
  )
}
