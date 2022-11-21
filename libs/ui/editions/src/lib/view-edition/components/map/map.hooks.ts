import { useCallback, useEffect, useMemo } from 'react';
import { range } from 'lodash';
import {
  useAuxiliarySurfacesMethods,
  useData,
  useLayoutData,
} from '../../contexts';
import { fabric } from 'fabric';
import { useWindowSize } from '@frontend/shared-ui';
import { MapPosition, RowVirtualizer } from '@frontend/ui/editions';
import { EditionStore } from '../../../store';

export function useMapData(edition: EditionStore) {
  const sigla = useMemo(() => edition.get_ms_sigla().split(','), [edition]);
  const NoUnits = useMemo(() => edition.get_no_rows(), [edition]);
  const dividers = useMemo(() => [...edition.get_dividers()], [edition]);
  const unitMatrix = useMemo(
    () =>
      range(sigla.length).map((i) => [
        ...edition.get_ms_unit_presence_array(i),
      ]),
    [edition, sigla.length]
  );
  const imageMatrix = useMemo(
    () =>
      range(sigla.length).map((i) => [
        ...edition.get_ms_image_presence_array(i),
      ]),
    [edition, sigla.length]
  );
  return {
    sigla,
    NoUnits,
    unitMatrix,
    imageMatrix,
    dividers,
  };
}

export function useMarkerContainers() {
  return {
    positionMarker: useMemo(() => new fabric.Rect({}), []),
    searchResultsMarkers: useMemo<fabric.Rect[]>(() => [], []),
    headerSigla: useMemo<fabric.Text[]>(() => [], []),
  };
}

export function useDimensions(mapState: MapPosition) {
  const windowSize = useWindowSize();
  const width = useMemo(() => {
    const base = windowSize.width;
    if (mapState.startsWith('left')) {
      return Math.round((base * 30.8) / 100);
    }
    return base;
  }, [windowSize.width, mapState]);
  const height = useMemo(() => {
    const base = windowSize.height;
    if (mapState === 'bottom') {
      return Math.round((base * 30.8) / 100);
    }
    return base - 50;
  }, [windowSize.height, mapState]);
  return { width, height };
}

export function useRowStateAndMethods(rowVirtualizer: RowVirtualizer | null) {
  const { setActiveUnitPreview } = useAuxiliarySurfacesMethods();
  const currentRow = useMemo(() => {
    if (rowVirtualizer && rowVirtualizer.virtualItems.length !== 0) {
      return Math.ceil(rowVirtualizer.virtualItems[0].index / 2);
    }
    return 0;
  }, [rowVirtualizer?.virtualItems]);

  const onRowClicked = useCallback(
    (row: number) => {
      if (rowVirtualizer) {
        rowVirtualizer.scrollToIndex(row, { align: 'start' });
      }
    },
    [rowVirtualizer]
  );
  const onRowHovered = (row: number, x: number, y: number) => {
    if (row === -1) {
      setActiveUnitPreview(null);
    } else {
      setActiveUnitPreview([row, x, y]);
    }
  };

  return { currentRow, onRowClicked, onRowHovered };
}
