import './table.module.scss';
import {DataEntrySchema} from "@frontend/util";

export interface ITableProps {
  data?: { [key: string]: any },
  schema: Partial<DataEntrySchema>[]
}

export function Table(props: ITableProps) {
  return (
    <div>
      <h1>Welcome to UiTable!</h1>
    </div>
  );
}

export default Table;
