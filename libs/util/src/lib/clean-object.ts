export function cleanObject(obj: object) {
  return Object.entries(obj)
    .filter(([_, v]) => ![null, undefined, '', 'null', 'undefined'].includes(v))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}
