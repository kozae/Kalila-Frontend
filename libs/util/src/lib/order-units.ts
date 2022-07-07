import { IUnitSummary } from '@frontend/domain';
import { sortBy } from 'lodash';

export function orderUnits(units: IUnitSummary[]) {
  units = sortBy(units, (u) => u.Start[2]);
  units = sortBy(units, (u) => u.Start[1]);
  return sortBy(units, (u) => u.Start[0]);
}
