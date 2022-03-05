export function sleeper(ms: number) {
  return function () {
    return new Promise((resolve) => setTimeout(() => resolve(0), ms));
  };
}
