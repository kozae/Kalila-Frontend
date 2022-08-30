import { useCallback } from 'react';
import { VirtualItem } from 'react-virtual';
import { EditionUnitTitle } from '../edition-unit-title';
import { EditionRow } from '../edition-row';
import {
  EditionFontFamily,
  EditionFontSize,
  IEditionPageData,
} from '../models';

export function useRowGetter({
  edition,
  rows,
  cells,
  font,
  size,
  numberOfManuscripts,
  setHorizontalCollation,
  setVisibleImageCycle,
}: IEditionPageData & {
  font: EditionFontFamily;
  size: EditionFontSize;
  numberOfManuscripts: number;
  setHorizontalCollation: (v: number | null) => void;
  setVisibleImageCycle: (v: number | null) => void;
}) {
  return useCallback(
    (row: VirtualItem) => {
      const unitIndex = Math.floor(row.index / 2);
      const key = `${row.index}.${size}.${font}`;
      if (row.index % 2 === 0) {
        return (
          <div
            key={key}
            ref={row.measureRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
            }}
          >
            {rows[unitIndex] && (
              <EditionUnitTitle
                showUnitHorizontalCollation={() =>
                  setHorizontalCollation(unitIndex)
                }
                showImageCycle={() => setVisibleImageCycle(unitIndex)}
                data={rows[unitIndex]}
                unitIdx={unitIndex}
              />
            )}
          </div>
        );
      }
      return (
        <div
          key={key}
          ref={row.measureRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${row.start}px)`,
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          {cells[unitIndex] && (
            <EditionRow
              manuscripts={numberOfManuscripts}
              data={cells[unitIndex]}
            />
          )}
        </div>
      );
    },
    [edition, rows, cells, font, size]
  );
}
