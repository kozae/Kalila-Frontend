import { useCallback } from 'react';
import { VirtualItem } from 'react-virtual';
import { UnitTitle } from './unit-title';
import { useLayoutData } from '../../contexts';
import { Row } from './row';

export function useRowGetter() {
  const { font, size } = useLayoutData();
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
            <UnitTitle unitIdx={unitIndex} />
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
          <Row unitIdx={unitIndex} />
        </div>
      );
    },
    [font, size]
  );
}
