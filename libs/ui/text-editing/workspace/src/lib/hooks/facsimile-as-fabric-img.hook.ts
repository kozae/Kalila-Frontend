import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { loadImageAsFabricObject } from '@frontend/ui/facsimile';

export function useImageAsFabricObject(url: string) {
  const [fabricImg, setFabricImg] = useState<null | fabric.Image>(null);
  useEffect(() => {
    loadImageAsFabricObject(url, setFabricImg);
  }, [url]);
  return fabricImg;
}
