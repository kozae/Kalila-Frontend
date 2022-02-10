import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSortAmountDown,
  faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import Stack from '@mui/material/Stack';

export interface ISortHeaderProps {
  activeSort: any;
  onSort: any;
  colId: any;
}

export const SortHeader: React.FC<ISortHeaderProps> = ({
  children,
  activeSort,
  onSort,
  colId,
}) => {
  const sortValue = useMemo(() => {
    if (activeSort?.OrderBy === colId && activeSort?.SortDirection !== 'desc') {
      return 'asc';
    }
    if (activeSort?.OrderBy === colId && activeSort?.SortDirection === 'desc') {
      return 'desc';
    }
    return null;
  }, [activeSort, colId]);

  const handleSort = useCallback(
    (event: React.MouseEvent<HTMLElement>, newSort: string | null) => {
      if (newSort === 'asc') {
        onSort({ OrderBy: colId });
      }
      if (newSort === 'desc') {
        onSort({ OrderBy: colId, SortDirection: 'desc' });
      }
    },
    [onSort]
  );

  return (
    <Stack
      sx={{ mb: '.2rem' }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0.5}
    >
      {children}
      <ToggleButtonGroup
        size="small"
        value={sortValue}
        exclusive
        color="primary"
        onChange={handleSort}
        aria-label="text alignment"
      >
        <ToggleButton value="asc" aria-label="sort-ascending">
          <FontAwesomeIcon size="lg" icon={faSortAmountUpAlt} />
        </ToggleButton>
        <ToggleButton value="desc" aria-label="sort-descending">
          <FontAwesomeIcon size="lg" icon={faSortAmountDown} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};
