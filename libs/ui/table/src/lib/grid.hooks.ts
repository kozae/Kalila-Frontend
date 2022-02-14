import { NextRouter, useRouter } from 'next/router';
import {
  useParamsFromRouteQuery,
  useRegisteredEditors,
} from '@frontend/shared-ui';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { IFilterProps, ISortControlProps } from './column-controls';

export function initGrid(excludeFromFilter: string[] = []) {
  const router = useRouter();
  const editors = useRegisteredEditors();
  const {
    filter,
    sort,
    handleFilterChange,
    handleSortChange,
    handlePaginationChange,
  } = useParamsFromRouteQuery(router, excludeFromFilter);

  const headerProps: ISortControlProps & IFilterProps = useMemo(
    () => ({
      activeSort: { ...sort },
      activeFilter: { ...filter },
      onSort: handleSortChange,
      onFilter: handleFilterChange,
    }),
    [sort, filter, handleSortChange, handleFilterChange]
  );

  const [selection, setSelection] = useState<Set<string>>(new Set<string>());
  const clearSelection = () => setSelection(new Set<string>());

  return {
    editors,
    filter,
    selection,
    setSelection,
    clearSelection,
    handlePaginationChange,
    headerProps,
  };
}

export function resetSelectionOnQueryChange(
  clear: () => void,
  { query }: NextRouter
) {
  useEffect(() => {
    clear();
  }, [query]);
}
