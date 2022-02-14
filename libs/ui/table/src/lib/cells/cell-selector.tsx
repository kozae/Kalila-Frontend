import { InputModes, KalilaValueTypes } from '@frontend/util';
import { GenericCell } from './generic-cell';
import { BooleanCell } from './boolean-cell';
import { CommentaryCell } from './commentary-cell';

const CellComponents: {
  [key: string | number]: {
    [key: string | number]: (props: { value: any; odd: any }) => any;
  };
} = {
  [KalilaValueTypes.String]: {
    [InputModes.InputOne]: GenericCell,
    [InputModes.SelectOne]: CommentaryCell,
    [InputModes.RichText]: CommentaryCell,
    [InputModes.FileField]: CommentaryCell,
    [InputModes.ImageField]: CommentaryCell,
  },
  [KalilaValueTypes.Int]: {
    [InputModes.InputOne]: GenericCell,
    [InputModes.SelectOne]: GenericCell,
  },
  [KalilaValueTypes.Float]: {
    [InputModes.InputOne]: GenericCell,
    [InputModes.SelectOne]: GenericCell,
  },
  [KalilaValueTypes.Boolean]: {
    [InputModes.Boolean]: BooleanCell,
  },
  [KalilaValueTypes.StringList]: {
    [InputModes.InputMultiple]: GenericCell,
    [InputModes.SelectMultiple]: GenericCell,
  },
  [KalilaValueTypes.IntList]: {
    [InputModes.InputMultiple]: GenericCell,
    [InputModes.SelectMultiple]: GenericCell,
  },
  [KalilaValueTypes.FloatList]: {
    [InputModes.InputMultiple]: GenericCell,
    [InputModes.SelectMultiple]: GenericCell,
  },
  [KalilaValueTypes.Entity]: {
    [InputModes.SelectOne]: GenericCell,
    [InputModes.InputOne]: GenericCell,
  },
  [KalilaValueTypes.EntityNumericalRelation]: {
    [InputModes.SelectOne]: GenericCell,
    [InputModes.InputOne]: GenericCell,
  },
  [KalilaValueTypes.CategoricalAttribute]: {
    [InputModes.SelectOne]: GenericCell,
    [InputModes.InputOne]: GenericCell,
  },
  [KalilaValueTypes.EntityList]: {
    [InputModes.SelectMultiple]: GenericCell,
    [InputModes.InputMultiple]: GenericCell,
  },
  [KalilaValueTypes.EmbeddedEntityList]: {
    [InputModes.Table]: GenericCell,
    [InputModes.InputMultiple]: GenericCell,
  },
  [KalilaValueTypes.CategoricalAttributeList]: {
    [InputModes.SelectMultiple]: GenericCell,
    [InputModes.InputMultiple]: GenericCell,
  },
  [KalilaValueTypes.Date]: {
    [InputModes.SelectOne]: GenericCell,
    [InputModes.InputOne]: GenericCell,
  },
};

export const CellSelector = ({ value, column, odd }: any) => {
  return CellComponents[column.f.KalilaValueType][column.f.InputMode]({
    value,
    odd,
  });
};
