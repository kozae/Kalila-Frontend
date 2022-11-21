import {Reducer} from "react";

export interface IGroupsState {
  groups: Set<string>
}

export enum GroupsActionType {
  Add = "add",
  Remove = "remove",
  Clear = "clear"
}

export interface IGroupsAction {
  type: GroupsActionType,
  payload: string
}

export const groupsReducer: Reducer<IGroupsState, IGroupsAction> = (state, action) => {
  let groups = new Set<string>();
  switch (action.type) {
    case 'add':
      groups = new Set<string>(...state.groups, action.payload)
      break;
    case 'remove':
      groups = new Set<string>(...state.groups)
      groups.delete(action.payload)
      break;
    case 'clear':
      groups = new Set<string>()
      break;
  }
  return {groups};
}
