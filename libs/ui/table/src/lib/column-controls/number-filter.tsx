import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { filterNonInteger } from '@frontend/ui/forms';
import * as React from 'react';
import { IFilterProps, IHeaderProps } from '@frontend/ui/table';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useFilterFieldState } from './filter-field-state.hook';

export const NumberFilter = ({
  f,
  onFilter,
  activeFilter,
}: IFilterProps & Partial<IHeaderProps>) => {
  const minAccessor = `${f?.FieldNamePascalCase}Gt`;
  const maxAccessor = `${f?.FieldNamePascalCase}Lt`;
  const [minValue, minRef, minOnChange] = useFilterFieldState(
    minAccessor,
    activeFilter
  );
  const [maxValue, maxRef, maxOnChange] = useFilterFieldState(
    maxAccessor,
    activeFilter
  );

  return (
    <Stack sx={{ mt: '.2rem' }} spacing={0.5}>
      <Stack direction="row" spacing={1}>
        <TextField
          sx={{ width: '85px' }}
          value={minValue}
          inputRef={minRef}
          size="small"
          onChange={(e: any) => filterNonInteger(e, minOnChange)}
          label="min"
          aria-label={`${f?.FieldNamePascalCase}_min`}
          variant="outlined"
        />
        <TextField
          sx={{ width: '85px' }}
          value={maxValue}
          inputRef={maxRef}
          size="small"
          onChange={(e: any) => filterNonInteger(e, maxOnChange)}
          label="max"
          aria-label={`${f?.FieldNamePascalCase}_max`}
          variant="outlined"
        />
      </Stack>
      <Button
        size="small"
        startIcon={<FilterAltIcon />}
        disableElevation
        variant="contained"
        onClick={() =>
          onFilter({
            ...activeFilter,
            [minAccessor]: minValue,
            [maxAccessor]: maxValue,
          })
        }
      >
        Apply Filter
      </Button>
    </Stack>
  );
};
