import { IFilterProps, IHeaderProps } from '@frontend/ui/table';
import Autocomplete from '@mui/material/Autocomplete';
import { useAutoCompleteFieldState } from './filter-field-state.hook';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Stack from '@mui/material/Stack';

import * as React from 'react';
import { useMemo } from 'react';

export const CategoricalAttributeFilter = ({
  f,
  onFilter,
  activeFilter,
  categoricalAttributes,
}: IFilterProps & Partial<IHeaderProps>) => {
  const options = useMemo(() => {
    return categoricalAttributes
      ? [...categoricalAttributes[f?.CategoricalAttributeType as string], '']
      : [''];
  }, [categoricalAttributes]);
  const accessor = `${f?.FieldNamePascalCase}Cn`;
  const [value, ref, onChange] = useAutoCompleteFieldState(
    accessor,
    activeFilter,
    options[0]
  );

  return (
    <Stack sx={{ width: '100%', offset: '.2rem' }} spacing={0.5}>
      <Autocomplete
        disablePortal
        fullWidth
        id={`${accessor}_filter`}
        onChange={onChange}
        value={value}
        options={options}
        renderInput={(params) => (
          <TextField inputRef={ref} {...params} label="Filter" />
        )}
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
