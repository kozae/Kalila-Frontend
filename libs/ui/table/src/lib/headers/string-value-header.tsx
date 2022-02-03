import styles from './header.module.scss'
import {useRef, useEffect, useState, useMemo, useCallback} from "react";
import Box from "@mui/material/Box";
import FilterIcon from "@mui/icons-material/Filter";
import TextField from "@mui/material/TextField";
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp';

function useStringFilterFieldState(accessor: string, activeFilter: Record<string, any>, onFilter: (newFilter: Record<string, any>) => void) {

  const [value, setValue] = useState(activeFilter[accessor] ?? '');
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setValue(activeFilter[accessor] ?? '')
    if (ref.current) {
      ref.current.focus()
    }
  }, [activeFilter[accessor]])

  useEffect(() => {
    const active = activeFilter[accessor] ?? '';
    if (value !== active) {
      onFilter({...activeFilter, [accessor]: value})
    }
  }, [value])

  const onChange = (e: any) => setValue(e.currentTarget.value)

  return [value, ref, onChange]

}


const StringFilterField = ({placeholder, ariaLabel, accessor, activeFilter, onFilter}: any) => {
  const [value, ref, onChange] = useStringFilterFieldState(accessor, activeFilter, onFilter);
  return (
    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
      <FilterIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
      <TextField value={value}
                 onChange={onChange}
                 label={placeholder}
                 aria-label={ariaLabel}
                 variant="standard"/>
    </Box>
  )

}

export const StringValueHeader = (props: any) => {

  const filterProps =
    {
      accessor: `${props.column.colId}Cn`,
      placeholder: 'Filter',
      ariaLabel: `${props.displayName} contains`,
      activeFilter: props.activeFilter,
      onFilter: props.onFilter
    }

  const sortValue = useMemo(() => {
    if (props.activeSort?.OrderBy === props.column.colId && props.activeSort?.SortDirection !== 'desc') {
      return 'asc'
    }
    if (props.activeSort?.OrderBy === props.column.colId && props.activeSort?.SortDirection === 'desc') {
      return 'desc'
    }
    return null
  }, [props.activeSort, props.column])

  const handleSort = useCallback((
    event: React.MouseEvent<HTMLElement>,
    newSort: string | null,
  ) => {
    if (newSort === 'asc') {
      props.onSort({OrderBy: props.column.colId})
    }
    if (newSort === 'desc') {
      props.onSort({OrderBy: props.column.colId, SortDirection: 'desc'})
    }
  }, [props.onSort])

  return (
    <div className={styles['container']}>
      <div className={styles['label-sort']}>
        <div className={styles['label']}>{props.displayName}</div>
        <div className={styles['sort']}>
          <ToggleButtonGroup
            value={sortValue}
            exclusive
            onChange={handleSort}
            aria-label="text alignment"
          >
            <ToggleButton value="asc" aria-label="sort-ascending">
              <ArrowUpwardSharpIcon />
            </ToggleButton>
            <ToggleButton value="desc" aria-label="sort-descending">
              <ArrowDownwardSharpIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <StringFilterField {...filterProps} />
    </div>
  );
};
