import { NextRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { cleanObject, IPagination } from '@frontend/util';

export function useParamsFromRouteQuery(
  router: NextRouter,
  excludeFromFilter: string[] = []
) {
  const { filter, sort } = useMemo(() => {
    const { PageSize, PageNumber, OrderBy, SortDirection, ...rest } =
      router.query;
    excludeFromFilter.forEach((key) => (rest[key] = undefined));
    return { filter: cleanObject(rest), sort: { OrderBy, SortDirection } };
  }, [router.query]);

  const handlePaginationChange = useCallback(
    (pagination: IPagination) => {
      return router.push({
        pathname: router.pathname,
        query: cleanObject({
          ...router.query,
          PageSize: pagination.itemsPerPage,
          PageNumber: pagination.currentPage,
        }),
      });
    },
    [router.query]
  );

  const handleSortChange = useCallback(
    async (sort: { OrderBy?: string; SortDirection?: 'asc' | 'desc' }) => {
      await router.push({
        pathname: router.pathname,
        query: cleanObject({
          ...router.query,
          OrderBy: sort.OrderBy,
          SortDirection: sort.SortDirection,
        }),
      });
    },
    [router.query]
  );

  const handleFilterChange = useCallback(
    async (filter: any) => {
      await router.push({
        pathname: router.pathname,
        query: cleanObject({
          ...router.query,
          PageNumber: 1,
          ...filter,
        }),
      });
    },
    [router.query]
  );

  return {
    filter,
    sort,
    handleFilterChange,
    handleSortChange,
    handlePaginationChange,
  };
}
