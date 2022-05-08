import { FacsimileCropper } from './wasm';
import useSWR from 'swr';
import { IFacsimileRegion } from '@frontend/domain';

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
  region: IFacsimileRegion
): [Uint32Array, number] => {
  const p = new Uint32Array(8);
  p[0] = region.Points[0].X;
  p[1] = region.Points[0].Y;
  p[2] = region.Points[1].X;
  p[3] = region.Points[1].Y;
  p[4] = region.Points[2].X;
  p[5] = region.Points[2].Y;
  p[6] = region.Points[3].X;
  p[7] = region.Points[3].Y;
  return [p, region.Rotation];
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
