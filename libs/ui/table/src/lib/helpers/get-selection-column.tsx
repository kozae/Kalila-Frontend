import CheckIcon from '@mui/icons-material/Check';
import { CheckboxCell } from '@frontend/ui/table';
import React from 'react';
import { Column } from 'react-table';
import { KalilaDocument } from '@frontend/domain';

export function getSelectionColumn<T extends KalilaDocument>(
  selection: Set<string>,
  setSelection: (Ids: Set<string>) => void
): Column<T> {
  return {
    Header: () => <CheckIcon />,
    accessor: 'Id',
    Cell: ({ value }: any) => (
      <CheckboxCell
        Id={value}
        selection={selection}
        setSelection={setSelection}
      />
    ),
  };
}
