import { addDataUrl, useAppDispatch } from '@frontend/shared-ui';
import { useCallback, useEffect } from 'react';
import { createRegionsDataUrls } from '@frontend/ui/facsimile';
import { FacsimileCanvasState } from './facsimile-canvas-state.hook';

export function useDataUrlGeneration({
  regions,
  fabricImg,
}: FacsimileCanvasState) {
  const dispatch = useAppDispatch();
  const storeDataUrl = useCallback((id: string, data: string) => {
    dispatch(addDataUrl({ id, data }));
  }, []);
  useEffect(() => {
    if (fabricImg !== null) {
      createRegionsDataUrls(regions, fabricImg, storeDataUrl);
    }
  }, [regions, fabricImg]);
}
