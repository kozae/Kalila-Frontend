import styles from './header.module.scss';
import * as React from 'react';
import { SortHeader } from './sort-header';
import { useFilterFieldState } from './filter-field-state.hook';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { filterNonInteger } from '@frontend/ui/forms';

const NumberFilterField = ({
  colId,
  ariaLabel,
  activeFilter,
  onFilter,
}: any) => {
  const [minValue, minRef, minOnChange] = useFilterFieldState(
    `${colId}Gt`,
    activeFilter,
    onFilter
  );
  const [maxValue, maxRef, maxOnChange] = useFilterFieldState(
    `${colId}Lt`,
    activeFilter,
    onFilter
  );

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        sx={{ width: '85px' }}
        value={minValue}
        inputRef={minRef}
        size="small"
        onChange={(e: any) => filterNonInteger(e, minOnChange)}
        label="min"
        aria-label={`${ariaLabel}_min`}
        variant="outlined"
      />
      <TextField
        sx={{ width: '85px' }}
        value={maxValue}
        inputRef={maxRef}
        size="small"
        onChange={(e: any) => filterNonInteger(e, maxOnChange)}
        label="max"
        aria-label={`${ariaLabel}_max`}
        variant="outlined"
      />
    </Stack>
  );
};

export const NumberValueHeader = (props: any) => {
  const filterProps = {
    colId: props.column.colId,
    ariaLabel: `${props.displayName}`,
    activeFilter: props.activeFilter,
    onFilter: props.onFilter,
  };

  const sortProps = {
    activeSort: props.activeSort,
    onSort: props.onSort,
    colId: props.column.colId,
  };

  return (
    <div className={styles['container']}>
      <SortHeader {...sortProps}>
        <div className={styles['label']}>{props.displayName}</div>
      </SortHeader>
      <NumberFilterField {...filterProps} />
    </div>
  );
};
