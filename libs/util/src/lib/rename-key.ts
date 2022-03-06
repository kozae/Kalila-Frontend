export function renameKey(o: any, old: string, replacement: string) {
  if (old !== replacement) {
    Object.defineProperty(
      o,
      replacement,
      Object.getOwnPropertyDescriptor(o, old)
    );
    delete o[old];
  }
  return o;
}
