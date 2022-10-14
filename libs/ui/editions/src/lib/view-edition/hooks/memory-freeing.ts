import { useEffect } from 'react';
import { EditionCellData, EditionRowTitle, EditionStore } from '../../store';

export function useMemoryFreeingOnDismount(
  edition: EditionStore,
  rows: EditionRowTitle[],
  cells: EditionCellData[][]
) {
  useEffect(() => {
    return () => {
      edition.free();
      rows.forEach((row) => row.free());
      cells.forEach((row) => row.forEach((cell) => cell.free()));
    };
  }, []);
}
