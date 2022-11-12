import { IDataEntrySchema, KalilaValueTypes } from '@frontend/util';
import { SxProps } from '@mui/system/styleFunctionSx';
import { ISortControlProps, IFilterProps } from '../column-controls';

export interface IHeaderProps extends ISortControlProps, IFilterProps {
  f: Partial<IDataEntrySchema> & { overrideFilter?: string | KalilaValueTypes };
  bgcolor: string;
  color: string;
  sx?: SxProps;
}
