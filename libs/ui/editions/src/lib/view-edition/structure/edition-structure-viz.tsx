import { FabricCanvas } from '@frontend/ui/facsimile';
import { FC, useEffect, useMemo, useState } from 'react';
import { fabric } from 'fabric';
import { useWindowSize } from '@frontend/shared-ui';
import {
  IStructureData,
  IStructureEvents,
  render,
  unitNumberLineOffset,
} from './render';
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
import { SearchResults } from '../models';

export interface EditionStructureVizProps
  extends IStructureData,
    IStructureEvents {
  showNavbar: boolean;
  searchResults: SearchResults;
}

export const EditionStructureViz: FC<EditionStructureVizProps> = ({
  position,
  sigla,
  NoUnits,
  unitMatrix,
  imageMatrix,
  currentRow,
  onRowClicked,
  onRowHovered,
  showNavbar,
  searchResults,
}) => {
  const positionMarker = useMemo(() => new fabric.Rect({}), []);
  const windowSize = useWindowSize();
  const width = useMemo(() => {
    const base = windowSize.width;
    if (position.startsWith('left')) {
      return Math.round((base * 30.8) / 100);
    }
    return base;
  }, [windowSize.width, position]);
  const height = useMemo(() => {
    const base = windowSize.height;
    if (position === 'bottom') {
      return Math.round((base * 30.8) / 100);
    }
    return showNavbar ? base - 110 : base - 50;
  }, [windowSize.height, showNavbar, position]);
  const searchResultsMarkers: fabric.Rect[] = useMemo(() => [], []);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const onReady = (c: fabric.Canvas) => {
    console.log('canvas ready');
    render(c, positionMarker, {
      sigla,
      NoUnits,
      unitMatrix,
      currentRow,
      onRowClicked,
      onRowHovered,
      position,
      imageMatrix,
    });
    if (searchResults) {
      renderSearchResults(
        c,
        searchResults as [number, number, number][],
        position,
        NoUnits,
        sigla.length,
        searchResultsMarkers
      );
    }
    setCanvas(c);
  };

  useEffect(() => {
    if (canvas) {
      console.log('rerendering');
      canvas.setWidth(width);
      canvas.setHeight(height);
      render(canvas, positionMarker, {
        sigla,
        NoUnits,
        unitMatrix,
        currentRow,
        onRowClicked,
        onRowHovered,
        position,
        imageMatrix,
      });
      searchResultsMarkers.splice(0, searchResultsMarkers.length);
      if (searchResults) {
        renderSearchResults(
          canvas,
          searchResults as [number, number, number][],
          position,
          NoUnits,
          sigla.length,
          searchResultsMarkers
        );
      }
    }
  }, [windowSize, showNavbar, position]);

  useEffect(() => {
    if (canvas) {
      const unitLineThickness = getUnitThickness(canvas, position, NoUnits);
      const options = getPositionMarkerOptions(
        canvas,
        position,
        currentRow,
        position.endsWith('XL') ? unitLineThickness / 4 : unitLineThickness
      );
      positionMarker.set('top', options.top);
      positionMarker.set('left', options.left);
      positionMarker.set('width', options.width);
      positionMarker.set('height', options.height);
      canvas.renderAll();
    }
  }, [currentRow, position, NoUnits]);

  useEffect(() => {
    if (canvas) {
      canvas.remove(...searchResultsMarkers);
      searchResultsMarkers.splice(0, searchResultsMarkers.length);
      canvas.renderAll();
      if (searchResults) {
        renderSearchResults(
          canvas,
          searchResults as [number, number, number][],
          position,
          NoUnits,
          sigla.length,
          searchResultsMarkers
        );
      }
    }
  }, [searchResults]);

  const onDispose = () => {
    console.log('canvas disposed');
  };
  return (
    <Stack position="relative">
      {position === 'left-XL' && (
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
            sigla.map((siglum, i) => (
              <Box
                height="30px"
                width={`${getManuscriptThickness(
                  canvas,
                  position,
                  sigla.length
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
        create={windowSize.height !== 0 && windowSize.width !== 0}
        width={width}
        height={height}
        onReady={onReady}
        onDispose={onDispose}
      />
    </Stack>
  );
};
