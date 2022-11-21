import { IDataEntrySchema } from './data-entry-schema';

export interface ActivitySchema {
  Fields: IDataEntrySchema[];
  CategoricalAttributes: Record<string, any[]>;
}
