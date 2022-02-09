import { NextRouter, useRouter } from 'next/router';
import {
  useParamsFromRouteQuery,
  useRegisteredEditors,
} from '@frontend/shared-ui';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';

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

  const headerComponentParams = useMemo(
    () => ({
      activeSort: { ...sort },
      activeFilter: { ...filter },
      onSort: handleSortChange,
      onFilter: handleFilterChange,
    }),
    [sort, filter, handleSortChange, handleFilterChange]
  );

  return { editors, filter, handlePaginationChange, headerComponentParams };
}

export function resetSelectionOnQueryChange(
  setter: Dispatch<SetStateAction<any[]>>,
  { query }: NextRouter
) {
  useEffect(() => {
    setter([]);
  }, [query]);
}

export function useGridParams(
  { state, setSelection }: any,
  additionalParams = {}
) {
  const gridParams = useMemo(
    () => ({
      onSelectionChanged: (event: any) =>
        setSelection(event.api.getSelectedRows()),
      rowData: state?.documents ?? [],
      ...additionalParams,
    }),
    [state, setSelection, additionalParams]
  );

  return gridParams;
}
