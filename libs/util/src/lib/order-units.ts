import { IUnitSummary } from '@frontend/domain';
import { sortBy } from 'lodash';

export function orderUnits(units: IUnitSummary[]) {
  units = sortBy(units, (u) => u.Start[2]); // token
  units = sortBy(units, (u) => u.Start[1]); // line
  return sortBy(units, (u) => u.Start[0]); // page
}
