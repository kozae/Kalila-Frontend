import './table.module.scss';
import {ActivitySchema} from "@frontend/util";
import React, {useEffect} from "react";

export interface ITableProps {
  data?: { [key: string]: any },
  schema?: ActivitySchema
}

export const Table: React.FC<ITableProps> = ({data, schema}) => {
  useEffect(() => {
    console.log({data})
  }, [data])
  useEffect(() => {
    console.log({schema})
  }, [schema])
  return (
    <div>
      <h1>Welcome to UiTable!</h1>
    </div>
  );
}

