import React, {useMemo} from "react";
import {CommandBar, ICommandBarItemProps} from "@fluentui/react";
import styles from './administration-command-bar.module.scss'
import {IPagination} from "@frontend/util";


export interface IAdministrationCommandBarProps {
  enableEditSelection?: boolean,
  enableEditByFilter?: boolean,
  enableDelete?: boolean,
  pagination: IPagination,
  onPaginationChange: (pagination: IPagination) => void
}

export const AdministrationCommandBar: React.FC<IAdministrationCommandBarProps> = (
  {
    enableEditSelection,
    enableEditByFilter,
    enableDelete,
    pagination,
    onPaginationChange
  }) => {
  const pageSizes = [5, 10, 20];
  const _items = useMemo<ICommandBarItemProps[]>(() => [
    {
      key: 'Create',
      text: 'Create',
      iconProps: {iconName: 'Add'},
      ariaLabel: 'Create',
    },
    {
      key: 'Edit',
      text: enableEditSelection ? 'Edit selected' : enableEditByFilter ? 'Edit filtered' : 'Edit',
      iconProps: {iconName: 'Edit'},
      ariaLabel: 'Edit',
      disabled: !enableEditByFilter && !enableEditSelection,
    },
    {
      key: 'delete',
      text: 'Delete',
      iconProps: {iconName: 'Delete'},
      buttonStyles: {icon: {color: 'red'}},
      ariaLabel: 'Delete',
      disabled: !enableDelete,
    }
  ], [enableEditByFilter, enableEditSelection, enableDelete])

  const _farItems = useMemo<ICommandBarItemProps[]>(() => {
    let {itemsPerPage: pageSize} = pagination;
    const {totalItems, totalPages, currentPage} = pagination;
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
  }, [pagination])


  return (
    <div className={styles["container"]}>
      <CommandBar
        style={{width: 'fit-content'}}
        onReduceData={() => undefined}
        items={_items}
        farItems={_farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
    </div>
  );
}
