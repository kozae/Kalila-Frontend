import React, {useMemo} from "react";
import {CommandBar, ICommandBarItemProps} from "@fluentui/react";
import {IAdminPageContext, useAdminPageContext} from "../admin-page.context";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {KalilaDocument} from "@frontend/domain";


export interface IAdministrationCommandBarProps<T extends KalilaDocument> {
  cls: ClassConstructor<T> // just for type inference
  selection: T[],
  onCreate: () => void,
  onEdit: () => void,
  onDelete: () => void,
}

export const AdministrationCommandBar = <T extends KalilaDocument>(
  {
    selection,
    onCreate,
    onEdit,
    onDelete
  }:  IAdministrationCommandBarProps<T>) => {

  const {filter} = useAdminPageContext<T>() as IAdminPageContext<T>;

  const _items = useMemo<ICommandBarItemProps[]>(() => {
    const enableEditSelection = selection.length > 0,
      enableEditByFilter = Object.keys(filter).length > 0,
      enableDelete = selection.length === 1;
    return [
      {
        key: 'Create',
        text: 'Create',
        iconProps: {iconName: 'Add'},
        ariaLabel: 'Create',
        onClick: onCreate
      },
      {
        key: 'Edit',
        text: enableEditSelection ? 'Edit selected' : enableEditByFilter ? 'Edit filtered' : 'Edit',
        iconProps: {iconName: 'Edit'},
        ariaLabel: 'Edit',
        disabled: !enableEditByFilter && !enableEditSelection,
        onClick: onEdit
      },
      {
        key: 'delete',
        text: 'Delete',
        iconProps: {iconName: 'Delete'},
        buttonStyles: {icon: {color: 'red'}},
        ariaLabel: 'Delete',
        disabled: !enableDelete,
        onClick: onDelete
      }
    ]
  }, [filter, selection])


  return (
    <CommandBar
      style={{width: 'fit-content'}}
      onReduceData={() => undefined}
      items={_items}
      ariaLabel="Use left and right arrow keys to navigate between commands"
    />
  );
}
