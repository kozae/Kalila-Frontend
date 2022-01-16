import { DataEntrySchema } from './data-entry-schema';

export interface ActivitySchema {
  Fields: DataEntrySchema[];
  CategoricalAttributes: Map<string, string[]>;
}
