import { sum } from 'lodash';

export function convertToNumericOrder(order: number[]) {
  const clone = [...order];
  while (clone.length < 8) clone.push(0);
  return sum(clone.map((n, i) => n * Math.pow(10, 8 - 3 * i)));
}
