import React, {useMemo} from "react";
import {CommandBar, ICommandBarItemProps} from "@fluentui/react";


export interface IAdministrationCommandBarProps {
  enableEditSelection?: boolean,
  enableEditByFilter?: boolean,
  enableDelete?: boolean,
}

export const AdministrationCommandBar: React.FC<IAdministrationCommandBarProps> = (
  {
    enableEditSelection,
    enableEditByFilter,
    enableDelete
  }) => {
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




  return (
      <CommandBar
        style={{width: 'fit-content'}}
        onReduceData={() => undefined}
        items={_items}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
  );
}
