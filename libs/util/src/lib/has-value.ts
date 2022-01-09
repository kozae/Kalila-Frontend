export const stringHasValue = (value: string): boolean => {
  return ![undefined, null, ''].includes(value);
}
