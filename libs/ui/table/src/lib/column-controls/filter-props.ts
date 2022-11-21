import { KalilaValueTypes } from '@frontend/util';

export interface IFilterProps {
  exactMatch?: boolean;
  activeFilter: any;
  categoricalAttributes?: Record<string, string[]>;
  onFilter: (newFilter: any) => any;
  overrideFilter?: string | KalilaValueTypes;
}
