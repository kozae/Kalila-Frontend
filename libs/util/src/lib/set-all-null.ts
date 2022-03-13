export function setAll(obj, val) {
  Object.keys(obj).forEach(function (index) {
    obj[index] = val;
  });
  return obj;
}

export const setAllNull = (obj) => setAll(obj, null);
