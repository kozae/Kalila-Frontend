import {Column} from "react-table";

export const withAdministrativeColumns = <T extends object>(columns: Column<T>[]) => [
  ...columns,
  {
    Header: 'editor',
    accessor: 'Editor'
  },
  {
    Header: 'edition progress',
    accessor: 'EditionProgress'
  },
  {
    Header: 'created at',
    accessor: 'CreatedAt'
  },
  {
    Header: 'updated at',
    accessor: 'Version'
  },
] as Column<T>[]
