import { FacsimileCropper } from './wasm';
import useSWR from 'swr';
import { FacsimileRegion } from '@frontend/domain';

export function loadFacsimileCropper() {
  return import('./wasm');
}

export function useFacsimileCropper(
  url: string,
  create: (encoded_file: string) => FacsimileCropper
): FacsimileCropper | null {
  const { data } = useSWR(url, load);
  if (data) {
    return create(base46(data));
  }
  return null;
}

export const mapDataForCropper = (
  region: FacsimileRegion | Uint32Array
): [Uint32Array, number] => {
  const p = new Uint32Array(8);
  p[0] = region[0];
  p[1] = region[1];
  p[2] = region[2];
  p[3] = region[3];
  p[4] = region[4];
  p[5] = region[5];
  p[6] = region[6];
  p[7] = region[7];
  return [p, region[8]];
};

async function load(url: string) {
  const data: string = await fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function () {
            resolve(this.result as string);
          };
          reader.readAsDataURL(blob);
        })
    );

  return data;
}

const base46 = (data: string) =>
  data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
