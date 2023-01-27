import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import { range } from 'lodash';
import { useCallback } from 'react';
import { EditionRowTitle, EditionStore } from '../../../store';
import { useData } from '../../contexts';

export interface UnitTableRow {
  unitTitle: string;
  unitSequence: number;
  occurences: number[];
}

export interface UnitTable {
  rows: UnitTableRow[];
  sigla: string[];
}

export const DownloadControls = () => {
  const { edition, rows } = useData();

  const onDownloadUnitTable = useCallback(() => {
    const table = getUnitsTable(edition, rows);
    const csvFile = createCsvString(table);
    saveCsvFile(csvFile, `${edition.get_name()}.tsv`);
  }, [edition, rows]);

  return (
    <IconButton onClick={onDownloadUnitTable} color="secondary">
      <DownloadIcon />
    </IconButton>
  );
};

function getUnitsTable(edition: EditionStore, rows: EditionRowTitle[]) {
  const sigla: string[] = edition.get_ms_sigla().split(',');

  const presenceMap = sigla.reduce(
    (acc: Record<string, number[]>, siglum, msIndex) => {
      acc[siglum] = [...edition.get_ms_unit_presence_array(msIndex)];
      return acc;
    },
    {}
  );
  const regex = new RegExp(/^.*\)\s/gm);
  const units = range(edition.get_no_rows()).map((idx) =>
    rows[idx].get_display().replace(regex, '')
  );
  const tableRows: UnitTableRow[] = units.map((unitTitle, unitIndex) => {
    return {
      unitTitle,
      unitSequence: unitIndex + 1,
      occurences: sigla.map((siglum) => presenceMap[siglum][unitIndex]),
    };
  });

  return { rows: tableRows, sigla };
}

function createCsvString(table: UnitTable) {
  const header = ['seq.', 'unit title', ...table.sigla].join('\t') + '\n';
  const rows = table.rows
    .map((row) =>
      [
        `${row.unitSequence}`,
        row.unitTitle,
        ...row.occurences.map((v) => (v === -1 ? ' ' : `${v}`)),
      ].join('\t')
    )
    .join('\n');
  return header + rows;
}

function saveCsvFile(csvFile: string, filename: string) {
  const blob = new Blob([csvFile], { type: 'text/tsv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    // feature detection
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
