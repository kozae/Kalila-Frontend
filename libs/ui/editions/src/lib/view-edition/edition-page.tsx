import { IEdition } from '@frontend/domain';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useVirtual, VirtualItem } from 'react-virtual';
import { EditionUnitTitle } from './edition-unit-title';
import { EditionManuscriptBar } from './edition-manuscript-bar';
import { EditionRow } from './edition-row';
import dynamic from 'next/dynamic';
import { EditionStore, ImageStore } from '../store';

export const EditionPageWasm = dynamic({
  loader: async () => {
    const { EditionStore } = await import('../store');
    return ({ edition }: { edition: IEdition }) => {
      return (
        <EditionPage
          edition={EditionStore.load(edition)}
          imageStore={ImageStore.new()}
        />
      );
    };
  },
});

export interface IEditionPageProps {
  edition: EditionStore;
  imageStore: ImageStore;
}

export const EditionPage = ({ edition, imageStore }: IEditionPageProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    size: edition.get_no_book_units() * 2,
    parentRef,
  });

  const numberOfManuscripts = useMemo(
    () => edition.get_no_manuscripts(),
    [edition]
  );
  const getRow = useCallback(
    (row: VirtualItem) => {
      const unitIndex = Math.floor(row.index / 2);
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
            }}
          >
            <EditionUnitTitle
              display={edition.get_book_unit_display_title(unitIndex)}
            />
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
            alignItems: 'stretch',
          }}
        >
          <EditionRow
            unitId={edition.get_book_unit_id(unitIndex)}
            unitIdx={unitIndex}
            manuscripts={numberOfManuscripts}
            store={edition}
          />
        </div>
      );
    },
    [edition]
  );

  useEffect(() => {
    return () => {
      edition.free();
      imageStore.free();
    };
  }, []);

  return (
    <div
      ref={parentRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 110px)',
        overflow: 'auto',
      }}
    >
      <EditionManuscriptBar manuscripts={numberOfManuscripts} store={edition} />
      <div
        style={{
          height: rowVirtualizer.totalSize,
          width: `${200 * numberOfManuscripts}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map(getRow)}
      </div>
    </div>
  );
};
