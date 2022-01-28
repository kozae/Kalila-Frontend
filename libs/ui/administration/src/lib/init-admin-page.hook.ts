import {useRouter} from "next/router";
import {useParamsFromRouteQuery, useRegisteredEditors} from "@frontend/shared-ui";
import {useMemo} from "react";

export function initAdminPage() {
  const router = useRouter();
  const editors = useRegisteredEditors()
  const {
    filter,
    sort,
    handleFilterChange,
    handleSortChange,
    handlePaginationChange
  } = useParamsFromRouteQuery(router);

  const headerComponentParams = useMemo(() => ({
    activeSort: {...sort},
    activeFilter: {...filter},
    onSort: handleSortChange,
    onFilter: handleFilterChange
  }), [sort, filter, handleSortChange, handleFilterChange])

  return {editors, filter, handlePaginationChange, headerComponentParams}
}
