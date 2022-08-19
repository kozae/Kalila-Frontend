import { LineDetector } from './wasm';

export async function useLineDetector(url: string): Promise<LineDetector> {
  const app = await import('./wasm');
  const data = await load(url);
  return app.LineDetector.new(base46(data));
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
