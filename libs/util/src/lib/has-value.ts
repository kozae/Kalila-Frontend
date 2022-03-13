export const stringHasValue = (value: string | null | undefined): boolean => {
  return ![undefined, null, ''].includes(value);
};
