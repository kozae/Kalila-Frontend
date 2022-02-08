import styles from './header.module.scss';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { SortHeader } from './sort-header';
import { useFilterFieldState } from './filter-field-state.hook';

const StringFilterField = ({
  placeholder,
  ariaLabel,
  accessor,
  activeFilter,
  onFilter,
}: any) => {
  const [value, ref, onChange] = useFilterFieldState(
    accessor,
    activeFilter,
    onFilter
  );
  return (
    <TextField
      value={value}
      inputRef={ref}
      size="small"
      onChange={onChange}
      label={placeholder}
      aria-label={ariaLabel}
      variant="outlined"
    />
  );
};

export const StringValueHeader = (props: any) => {
  const filterProps = {
    accessor: props.exactMatch
      ? `${props.column.colId}Eq`
      : `${props.column.colId}Cn`,
    placeholder: props.exactMatch ? 'Find exact match' : 'Filter',
    ariaLabel: `${props.displayName} filter`,
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
      <StringFilterField {...filterProps} />
    </div>
  );
};
