import TextField from '@mui/material/TextField';
import * as React from 'react';
import { SortHeader } from './sort-header';
import { useFilterFieldState } from './filter-field-state.hook';
import { IHeaderProps } from './header-props';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
      color="primary"
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

export const StringValueHeader = ({
  Id,
  exactMatch,
  activeFilter,
  activeSort,
  onFilter,
  onSort,
  displayName,
}: IHeaderProps) => {
  const filterProps = {
    accessor: exactMatch ? `${Id}Eq` : `${Id}Cn`,
    placeholder: exactMatch ? 'Find exact match' : 'Filter',
    ariaLabel: `${Id} filter`,
    activeFilter: activeFilter,
    onFilter: onFilter,
  };

  const sortProps = {
    activeSort: activeSort,
    onSort: onSort,
    colId: Id,
  };

  return (
    <Box sx={{ width: '150px' }}>
      <SortHeader {...sortProps}>
        <Typography
          color="primary"
          sx={{ width: '100px', fontWeight: 800 }}
          variant="body1"
        >
          {displayName}
        </Typography>
      </SortHeader>
      <StringFilterField {...filterProps} />
    </Box>
  );
};
