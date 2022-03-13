import { IFilterProps, IHeaderProps } from '@frontend/ui/table';
import { useFilterFieldState } from './filter-field-state.hook';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';

export const BooleanFilter = ({
  f,
  onFilter,
  activeFilter,
}: IFilterProps & Partial<IHeaderProps>) => {
  const accessor = f?.FieldNamePascalCase as string;
  const [value, ref, onChange] = useFilterFieldState(accessor, activeFilter);
  const handleChange = (e: any) => {
    onChange(e);
    onFilter({ ...activeFilter, [accessor]: e.currentTarget.value });
  };
  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={value}
      exclusive
      onChange={handleChange}
    >
      <Tooltip title="Yes">
        <ToggleButton value="true">
          <CheckIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="No">
        <ToggleButton value="false">
          <CloseIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Data absent">
        <ToggleButton value="null">
          <Typography sx={{ color: 'inherit' }} variant="h5">
            &#x3D5;
          </Typography>
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};
