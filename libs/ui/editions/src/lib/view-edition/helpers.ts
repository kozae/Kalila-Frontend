import { EditionCellData, EditionRowTitle, EditionStore } from '../store';

export async function importEditionStore() {
  return await import('../store');
}

export function getRows(store: EditionStore): EditionRowTitle[] {
  const numRows = store.get_no_rows();
  return new Array(numRows)
    .fill(0)
    .map((_, rowIndex) => store.build_row(rowIndex));
}

export function getCells(store: EditionStore): EditionCellData[][] {
  const numRows = store.get_no_rows();
  const numCols = store.get_no_manuscripts();
  return new Array(numRows)
    .fill(0)
    .map((_, rowIndex) =>
      new Array(numCols)
        .fill(0)
        .map((_, colIndex) => store.build_cell(rowIndex, colIndex))
    );
}
