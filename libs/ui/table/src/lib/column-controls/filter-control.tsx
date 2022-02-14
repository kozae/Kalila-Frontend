import { IFilterProps, IHeaderProps } from '@frontend/ui/table';
import { KalilaValueTypes } from '@frontend/util';
import { StringFilter } from './string-filter';
import { NumberFilter } from './number-filter';
import { BooleanFilter } from './boolean-filter';
import { CategoricalAttributeFilter } from './categorical-attribute-filter';

const FilterComponents: {
  [key: string | number]: (props: IFilterProps & Partial<IHeaderProps>) => any;
} = {
  [KalilaValueTypes.String]: StringFilter,
  [KalilaValueTypes.Int]: NumberFilter,
  [KalilaValueTypes.Float]: NumberFilter,
  [KalilaValueTypes.Boolean]: BooleanFilter,
  [KalilaValueTypes.StringList]: StringFilter,
  [KalilaValueTypes.IntList]: () => <></>,
  [KalilaValueTypes.FloatList]: () => <></>,
  [KalilaValueTypes.Entity]: () => <></>,
  [KalilaValueTypes.EntityNumericalRelation]: () => <></>,
  [KalilaValueTypes.CategoricalAttribute]: CategoricalAttributeFilter,
  [KalilaValueTypes.EntityList]: () => <></>,
  [KalilaValueTypes.EmbeddedEntityList]: StringFilter,
  [KalilaValueTypes.CategoricalAttributeList]: CategoricalAttributeFilter,
  [KalilaValueTypes.Date]: () => <></>,
};

export const FilterControl = (props: IFilterProps & Partial<IHeaderProps>) =>
  FilterComponents[props.f?.KalilaValueType as KalilaValueTypes](props);
