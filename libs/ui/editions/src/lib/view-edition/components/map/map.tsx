import { FabricCanvas } from '@frontend/ui/facsimile';
import { FC, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { render, unitNumberLineOffset } from './render';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { letterMap } from '@frontend/util';
import Typography from '@mui/material/Typography';
import {
  getManuscriptThickness,
  getPositionMarkerOptions,
  getUnitThickness,
} from './render-helpers';
import { renderSearchResults } from './render-search-results';
import {
  useData,
  useLayoutData,
  useLayoutDataMethods,
  useSearchData,
} from '../../contexts';
import { MapPosition } from '@frontend/ui/editions';
import {
  useDimensions,
  useMapData,
  useMarkerContainers,
  useRowStateAndMethods,
} from './map.hooks';
import { useSmallScreenMediaQuery } from '@frontend/shared-ui';

export const Map: FC<{ mapState: MapPosition }> = ({ mapState }) => {
  const { searchResults } = useSearchData();
  const { positionMarker, searchResultsMarkers, headerSigla } =
    useMarkerContainers();
  const { canvas } = useLayoutData();
  const { width, height } = useDimensions(mapState);
  const { setCanvas } = useLayoutDataMethods();
  const { edition, rowVirtualizer, updateTime } = useData();
  const { currentRow, onRowClicked, onRowHovered } =
    useRowStateAndMethods(rowVirtualizer);
  const mapData = useMapData(edition);
  const isSmallScreen = useSmallScreenMediaQuery();
  const onReady = (c: fabric.Canvas) => {
    console.log('canvas ready');
    render(c, positionMarker, headerSigla, isSmallScreen, {
      ...mapData,
      currentRow,
      onRowClicked,
      onRowHovered,
      position: mapState,
    });
    if (searchResults) {
      renderSearchResults(
        c,
        headerSigla,
        searchResults as [number, number, number][],
        mapState,
        mapData.NoUnits,
        mapData.sigla.length,
        searchResultsMarkers
      );
    }
    setCanvas(c);
  };

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      render(canvas, positionMarker, headerSigla, isSmallScreen, {
        ...mapData,
        currentRow,
        onRowClicked,
        onRowHovered,
        position: mapState,
      });
      searchResultsMarkers.splice(0, searchResultsMarkers.length);
      if (searchResults) {
        renderSearchResults(
          canvas,
          headerSigla,
          searchResults as [number, number, number][],
          mapState,
          mapData.NoUnits,
          mapData.sigla.length,
          searchResultsMarkers
        );
      }
    }
  }, [height, width, mapState, updateTime]);

  useEffect(() => {
    if (canvas) {
      const unitLineThickness = getUnitThickness(
        canvas,
        mapState,
        mapData.NoUnits
      );
      const options = getPositionMarkerOptions(
        canvas,
        mapState,
        currentRow,
        mapState.endsWith('XL') ? unitLineThickness / 4 : unitLineThickness
      );
      positionMarker.set('top', options.top);
      positionMarker.set('left', options.left);
      positionMarker.set('width', options.width);
      positionMarker.set('height', options.height);
      canvas.renderAll();
    }
  }, [currentRow, mapState, mapData.NoUnits, updateTime]);

  useEffect(() => {
    if (canvas) {
      canvas.remove(...searchResultsMarkers);
      searchResultsMarkers.splice(0, searchResultsMarkers.length);
      canvas.renderAll();
      if (searchResults) {
        renderSearchResults(
          canvas,
          headerSigla,
          searchResults as [number, number, number][],
          mapState,
          mapData.NoUnits,
          mapData.sigla.length,
          searchResultsMarkers
        );
      }
    }
  }, [searchResults]);

  const onDispose = () => {
    console.log('canvas disposed');
    setCanvas(null);
  };

  useEffect(() => {
    return () => {
      setCanvas(null);
    };
  }, []);
  return (
    <Stack position="relative">
      {mapState === 'left-XL' && (
        <Stack
          direction="row"
          bgcolor="rgba(255,255,255, 0.1)"
          position="sticky"
          width="100%"
          height="30px"
          zIndex="20"
          top="0"
        >
          <Box height="30px" width={`${unitNumberLineOffset}px`}></Box>
          {canvas &&
            mapData.sigla.map((siglum, i) => (
              <Box
                height="30px"
                width={`${getManuscriptThickness(
                  canvas,
                  mapState,
                  mapData.sigla.length
                )}px`}
                key={siglum}
              >
                <Typography
                  textAlign="center"
                  fontWeight="bold"
                  fontSize="18px"
                >
                  {letterMap[i]}
                </Typography>
              </Box>
            ))}
        </Stack>
      )}
      <FabricCanvas
        create={height !== 0 && width !== 0}
        width={width}
        height={height}
        onReady={onReady}
        onDispose={onDispose}
      />
    </Stack>
  );
};
