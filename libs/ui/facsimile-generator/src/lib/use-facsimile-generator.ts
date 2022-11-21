export async function useFacsimileGenerator() {
  const { generate_facsimile } = await import('./wasm');

  return generate_facsimile;
}
