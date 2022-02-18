import CheckIcon from '@mui/icons-material/Check';
import { CheckboxCell } from '@frontend/ui/table';
import React from 'react';
import { Column } from 'react-table';
import { KalilaDocument } from '@frontend/domain';

export function getSelectionColumn<T extends KalilaDocument>(
  mode: 'single' | 'multiple' = 'multiple'
): Column<T> {
  return {
    Header: () => <CheckIcon />,
    accessor: 'Id',
    Cell: ({ value }: any) => <CheckboxCell Id={value} mode={mode} />,
  };
}
