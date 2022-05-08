import styles from './facsimile-cropper.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { FacsimileCropper } from '../wasm';

async function useFacsimileCropper(url: string): Promise<FacsimileCropper> {
  const app = await import('../wasm');
  const data = await load(url);
  return app.FacsimileCropper.new(base46(data));
}

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

export interface IFacsimileCropperProps {
  fileName: string;
}

export function FacsimileCropperPlayground({
  fileName,
}: IFacsimileCropperProps) {
  const [image, setImage] = useState<null | string>(null);
  const [wasmImg, setWasmImg] = useState<FacsimileCropper | null>(null);
  const [regions, setRegions] = useState<[Uint32Array[], number]>([[], 0]);
  useEffect(() => {
    useFacsimileCropper(`/${fileName}.jpeg`)
      .then((imgCrp) => {
        setWasmImg(imgCrp);
        setImage(imgCrp.get_url());
      })
      .catch((err) => console.log(err));

    fetch(`/${fileName}.json`)
      .then((res) => res.json())
      .then(({ TextElements }: any) => {
        setRegions(
          TextElements.map(({ FacsimileRegion }: any) => {
            const p = new Uint32Array(8);
            p[0] = FacsimileRegion.Points[0].X;
            p[1] = FacsimileRegion.Points[0].Y;
            p[2] = FacsimileRegion.Points[1].X;
            p[3] = FacsimileRegion.Points[1].Y;
            p[4] = FacsimileRegion.Points[2].X;
            p[5] = FacsimileRegion.Points[2].Y;
            p[6] = FacsimileRegion.Points[3].X;
            p[7] = FacsimileRegion.Points[3].Y;
            return [p, FacsimileRegion.Rotation];
          })
        );
      });
    return () => {
      if (wasmImg) {
        wasmImg.free();
      }
    };
  }, []);

  const getRegion = useCallback(
    (i: number) => {
      if (wasmImg) {
        //@ts-ignore
        const p = regions[i][0] as Uint32Array;
        //@ts-ignore
        const r = regions[i][1] as number;
        setImage(wasmImg.get_region(p, r));
      }
    },
    [wasmImg, regions]
  );

  return (
    <div className={styles['container']}>
      <div style={{ padding: '10px' }}>
        {regions.map((_, i) => (
          <button key={i} onClick={() => getRegion(i)}>
            region {i}
          </button>
        ))}
      </div>
      {image && (
        <img
          style={{ border: 'solid black 2px' }}
          width="500"
          height="auto"
          src={image}
          alt="failed"
        />
      )}
    </div>
  );
}
