import { IFilterProps, IHeaderProps } from '@frontend/ui/table';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useFilterFieldState } from './filter-field-state.hook';

export const StringFilter = ({
  f,
  onFilter,
  activeFilter,
  exactMatch,
}: IFilterProps & Partial<IHeaderProps>) => {
  const accessor = exactMatch
      ? `${f?.FieldNamePascalCase}Eq`
      : `${f?.FieldNamePascalCase}Cn`,
    placeholder = exactMatch ? 'Find exact match' : 'Filter',
    ariaLabel = `${f?.FieldNamePascalCase} filter`;
  const [value, ref, onChange] = useFilterFieldState(accessor, activeFilter);
  return (
    <Stack sx={{ mt: '.2rem' }} spacing={0.5}>
      <TextField
        color="primary"
        value={value}
        inputRef={ref}
        size="small"
        onChange={onChange}
        label={placeholder}
        aria-label={ariaLabel}
        variant="outlined"
        autoComplete={'off'}
      />
      <Button
        size="small"
        startIcon={<FilterAltIcon />}
        disableElevation
        variant="contained"
        onClick={() => onFilter({ ...activeFilter, [accessor]: value })}
      >
        Apply Filter
      </Button>
    </Stack>
  );
};
