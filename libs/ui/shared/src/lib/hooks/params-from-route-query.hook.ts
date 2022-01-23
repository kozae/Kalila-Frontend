import {NextRouter} from "next/router";
import {useCallback, useMemo} from "react";
import {cleanObject, IPagination} from "@frontend/util";
import {debounce} from "lodash";

export function useParamsFromRouteQuery(router: NextRouter) {
  const {filter, sort} = useMemo(() => {
    const {PageSize, PageNumber, OrderBy, SortDirection, ...rest} = router.query;
    return {filter: rest, sort: {OrderBy, SortDirection}};
  }, [router.query])

  const handlePaginationChange = useCallback((pagination: IPagination) => {
    return router.push({
      pathname: router.pathname,
      query: cleanObject({
        ...router.query,
        PageSize: pagination.itemsPerPage,
        PageNumber: pagination.currentPage
      })
    })
  }, [router.query])

  const handleSortChange = useCallback(async (sort: { OrderBy?: string, SortDirection?: 'asc' | 'desc' }) => {
    await router.push({
      pathname: router.pathname,
      query: cleanObject({
        ...router.query,
        OrderBy: sort.OrderBy,
        SortDirection: sort.SortDirection
      })
    })
  }, [router.query])

  const handleFilterChange = useCallback(debounce(async (filter: any) => {
    await router.push({
      pathname: router.pathname,
      query: cleanObject({
        ...router.query,
        ...filter,
      })
    })
  }, 1000), [router.query])

  return {filter, sort, handleFilterChange, handleSortChange, handlePaginationChange}
}
