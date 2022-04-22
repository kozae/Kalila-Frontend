import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSortAmountDown,
  faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { IHeaderProps } from '../headers';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ISortControlProps {
  activeSort: any;
  onSort: any;
}

export const SortControl = ({
  onSort,
  f,
}: ISortControlProps & Partial<IHeaderProps>) => {
  const colId = f?.FieldNamePascalCase;

  return (
    <Stack sx={{ width: '100%', mt: '.5rem' }} spacing={0.5}>
      <Button
        size="small"
        startIcon={
          <FontAwesomeIcon
            size="lg"
            icon={faSortAmountUpAlt.iconName as IconProp}
          />
        }
        disableElevation
        variant="contained"
        onClick={() => onSort({ OrderBy: colId })}
      >
        Sort Ascending
      </Button>
      <Button
        size="small"
        startIcon={
          <FontAwesomeIcon
            size="lg"
            icon={faSortAmountDown.iconName as IconProp}
          />
        }
        disableElevation
        variant="contained"
        onClick={() => onSort({ OrderBy: colId, SortDirection: 'desc' })}
      >
        Sort Descending
      </Button>
    </Stack>
  );
};
