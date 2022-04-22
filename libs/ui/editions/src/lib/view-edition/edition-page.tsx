import { IEdition } from '@frontend/domain';
import { useCallback, useEffect, useRef } from 'react';
import { useVirtual, VirtualItem } from 'react-virtual';
import { EditionUnitTitle } from './edition-unit-title';
import { EditionManuscriptBar } from './edition-manuscript-bar';
import { EditionRow } from './edition-row';
import { getUnits } from '../helpers';
import dynamic from 'next/dynamic';

export interface IEditionPageProps {
  edition: IEdition;
}

const WasmComponent = dynamic({
  loader: async () => {
    const wasmModule = await import('../store');
    wasmModule.greet('Mahmoud');
    return () => <></>;
  },
});

export const EditionPage = ({ edition }: IEditionPageProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    size: edition.BookUnits.length * 2,
    parentRef,
  });

  const getRow = useCallback(
    (row: VirtualItem) => {
      const bu = edition.BookUnits[Math.floor(row.index / 2)];
      if (row.index % 2 === 0) {
        return (
          <div
            key={row.index}
            ref={row.measureRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <EditionUnitTitle bookUnit={bu} />
          </div>
        );
      }
      return (
        <div
          key={row.index}
          ref={row.measureRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${row.start}px)`,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <EditionRow bookUnit={bu} units={getUnits(bu, edition)} />
        </div>
      );
    },
    [edition]
  );

  return (
    <div
      ref={parentRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 110px)',
        overflow: 'auto',
      }}
    >
      <WasmComponent />
      <EditionManuscriptBar manuscripts={edition.Manuscripts} />
      <div
        style={{
          height: rowVirtualizer.totalSize,
          width: `${200 * edition.Manuscripts.length}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map(getRow)}
      </div>
    </div>
  );
};
