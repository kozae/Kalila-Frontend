import React from 'react';
import { once } from 'lodash';
import { ObjectSchema } from 'yup';
import { AnySchema } from 'yup/lib/schema';
import { IPagination } from '@frontend/util';
import { IEditor } from '@frontend/shared-ui';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { KalilaDocument } from '@frontend/domain';

export interface IAdminPageContext<T extends KalilaDocument> {
  activityName: string;
  initialValues: T;
  validationSchemaFactory: (config: {
    mode?: 'edit' | 'create';
    skip: Record<any, any>;
  }) => ObjectSchema<Record<any, AnySchema>>;
  cls: ClassConstructor<T>;
  createModalTitle: string;
  editModalTitle: Record<'one' | 'many' | 'filtered', string>;
  deleteModalMessage: string;
  filter: Record<string, any>;
  editors: IEditor[];
  onPaginationChange: (pagination: IPagination) => Promise<boolean>;
  additionalParams: any;
  selection: Set<string>;
  setSelection: (Ids: Set<string>) => void;
  clearSelection: () => void;
}

export const createAdminPageContext = once(<T extends KalilaDocument>() => {
  return React.createContext<IAdminPageContext<T> | null>(null);
});

export const useAdminPageContext = <T extends KalilaDocument>() =>
  React.useContext(createAdminPageContext<T>());
