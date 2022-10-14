import { useCallback, useEffect, useMemo } from 'react';
import { useBehaviorOptions, useData, useLayoutData } from '../../contexts';
import { WIDTH_OPTIONS } from '../../constants';
import { getEditionContainerStyle } from '../map';
import { ManuscriptBar } from './manuscript-bar';
import { useRowGetter } from './row-getter';

export const Collation = () => {
  const { size, font, showNavbar } = useLayoutData();
  const { mapState } = useBehaviorOptions();
  const { updateTime, edition, rowVirtualizer, collationParentRef } = useData();

  const numberOfManuscripts = useMemo(
    () => edition.get_no_manuscripts(),
    [edition]
  );
  const getWidth = useCallback(() => {
    const cellWidth = WIDTH_OPTIONS[size];
    return cellWidth * numberOfManuscripts;
  }, [size, numberOfManuscripts]);
  const getRow = useRowGetter();
  return (
    <div
      ref={collationParentRef}
      style={getEditionContainerStyle(mapState, showNavbar)}
    >
      <ManuscriptBar />
      <div
        key={`${size}.${font}.${updateTime}`}
        style={{
          height: rowVirtualizer?.totalSize,
          width: `${getWidth()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer?.virtualItems.map(getRow)}
      </div>
    </div>
  );
};
