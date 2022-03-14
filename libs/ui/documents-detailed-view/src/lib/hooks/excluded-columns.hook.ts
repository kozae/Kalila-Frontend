import { useEffect, useReducer, useState } from 'react';

type Actions =
  | {
      type: 'add' | 'remove';
      payload: string[];
      name: string;
    }
  | {
      type: 'load';
      payload: Set<string>;
      name: string;
    }
  | {
      type: 'reset';
      name: string;
    };

function reducer(state: Set<string>, action: Actions) {
  let newState: Set<string>;
  switch (action.type) {
    case 'load':
      return action.payload as Set<string>;
    case 'add':
      newState = new Set<string>([...state, ...action.payload]);
      break;
    case 'remove':
      newState = new Set<string>(
        [...state].filter((v) => !action.payload.includes(v))
      );
      break;
    case 'reset':
      newState = new Set<string>();
      break;
    default:
      throw new Error();
  }
  localStorage.setItem(
    `${action.name}_excludedColumns`,
    JSON.stringify([...newState])
  );
  return newState;
}

export function useExcludedColumns(name: string, init: string[] = []) {
  const [excludedColumns, dispatch] = useReducer(
    reducer,
    new Set<string>(init)
  );
  useEffect(() => {
    const stored = localStorage.getItem(`${name}_excludedColumns`);
    if (stored) {
      dispatch({
        type: 'load',
        payload: new Set<string>(JSON.parse(stored)),
        name,
      });
    }
  }, []);
  const excludeColumns = (value: string[]) =>
    dispatch({ type: 'add', payload: value, name });

  const includeColumns = (value: string[]) =>
    dispatch({ type: 'remove', payload: value, name });

  const resetColumns = () => dispatch({ type: 'reset', name });
  return { excludedColumns, excludeColumns, includeColumns, resetColumns };
}
