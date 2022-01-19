import {IPagination} from "@frontend/util";
import React, {useMemo} from "react";
import {CommandBar, ICommandBarItemProps} from "@fluentui/react";

export interface IPaginatorProps {
  pagination: IPagination,
  onPaginationChange: (pagination: IPagination) => void,
  pageSizes?: number[]
}

export const Paginator: React.FC<IPaginatorProps> = ({pagination, onPaginationChange, pageSizes}) => {
  const _items = useMemo<ICommandBarItemProps[]>(() => {
    let {itemsPerPage: pageSize} = pagination;
    const {totalItems, totalPages, currentPage} = pagination;
    pageSizes = pageSizes ?? [5, 10, 20];
    return [
      {
        key: 'first',
        text: 'First page',
        ariaLabel: 'First page',
        disabled: currentPage === 1,
        iconOnly: true,
        iconProps: {iconName: 'ChevronLeftEnd6'},
        onClick: () => onPaginationChange({...pagination, currentPage: 1})
      },
      {
        key: 'previous',
        text: 'Previous page',
        ariaLabel: 'Previous page',
        disabled: currentPage === 1,
        iconOnly: true,
        iconProps: {iconName: 'ChevronLeftSmall'},
        onClick: () => onPaginationChange({...pagination, currentPage: currentPage - 1})
      },
      {
        key: 'currentPage',
        text: `${(currentPage * pageSize) - pageSize + 1} to ${currentPage * pageSize} of ${totalItems}`,
        ariaLabel: 'Current page',
        disabled: true,
      },
      {
        key: 'itemsPerPage',
        text: `per page: ${pageSize}`,
        subMenuProps: {
          items: pageSizes.map((size) => ({
            key: `${size}`,
            name: `${size}`,
            canCheck: true,
            checked: pageSize === size,
            onClick: () => {
              pageSize = size;
              const lastPage = Math.ceil(totalItems / size);
              const newCurrentPage = currentPage > lastPage ? lastPage : currentPage;
              return onPaginationChange({...pagination, itemsPerPage: size, currentPage: newCurrentPage})
            },
          })),
        },
      },
      {
        key: 'next',
        text: 'Next page',
        ariaLabel: 'Next page',
        iconOnly: true,
        disabled: currentPage === totalPages,
        iconProps: {iconName: 'ChevronRightSmall'},
        onClick: () => onPaginationChange({...pagination, currentPage: currentPage + 1})
      },
      {
        key: 'last',
        text: 'Last page',
        ariaLabel: 'Last page',
        iconOnly: true,
        disabled: currentPage === totalPages,
        iconProps: {iconName: 'ChevronRightEnd6'},
        onClick: () => onPaginationChange({...pagination, currentPage: totalPages})
      },
    ]
  }, [pagination, pageSizes, onPaginationChange])

  return (
    <CommandBar
      style={{width: 'fit-content'}}
      onReduceData={() => undefined}
      items={_items}
      ariaLabel="Use left and right arrow keys to navigate between commands"
    />
  );
}
