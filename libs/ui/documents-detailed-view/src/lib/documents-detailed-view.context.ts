import React from 'react';
import { once } from 'lodash';
import { IPagination } from '@frontend/util';
import { IEditor } from '@frontend/shared-ui';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { KalilaDocument } from '@frontend/domain';

export interface IDocumentDetailedViewContext<T extends KalilaDocument> {
  activityName: string;
  cls: ClassConstructor<T>;
  additionalParams: any;
}

export const createDocumentDetailedViewContext = once(<
  T extends KalilaDocument
>() => {
  return React.createContext<IDocumentDetailedViewContext<T> | null>(null);
});

export const useDocumentDetailedViewContext = <T extends KalilaDocument>() =>
  React.useContext(createDocumentDetailedViewContext<T>());
