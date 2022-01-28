import React from "react";
import {once} from 'lodash';
import {ObjectSchema} from "yup";
import {AnySchema} from "yup/lib/schema";
import { IPagination} from "@frontend/util";
import {IEditor} from "@frontend/shared-ui";
import {ClassConstructor} from "class-transformer/types/interfaces";


export interface IAdminPageContext<T extends object> {
  activityName: string,
  initialValues: T,
  validationSchema: ObjectSchema<Record<keyof T, AnySchema>>,
  cls: ClassConstructor<T>,
  createModalTitle: string,
  filter: Record<string, any> ,
  editors: IEditor[],
  onPaginationChange: (pagination: IPagination) => Promise<boolean>,
}


export const createAdminPageContext = once(<T extends object>() => {
  return React.createContext<IAdminPageContext<T> | null>(null)
})

export const useAdminPageContext = <T extends object>() => React.useContext(createAdminPageContext<T>());
