export function hexToRgba(hex: string, opacity: number) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const { r, g, b } = result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
  return `rgba(${r},${g}, ${b}, ${opacity})`;
}

export function hexToRgbUint32Array(hex: string): Uint32Array {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const { r, g, b } = result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : { r: 0, g: 0, b: 0 };
  const arr = new Uint32Array(3);
  arr[0] = r;
  arr[1] = g;
  arr[2] = b;
  return arr
}
