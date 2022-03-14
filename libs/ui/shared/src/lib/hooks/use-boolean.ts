import * as React from 'react';

function useConst<T>(initialValue: T | (() => T)): T {
  // Use useRef to store the value because it's the least expensive built-in hook that works here
  // (we could also use `const [value] = React.useState(initialValue)` but that's more expensive
  // internally due to reducer handling which we don't need)
  const ref = React.useRef<{ value: T }>();
  if (ref.current === undefined) {
    // Box the value in an object so we can tell if it's initialized even if the initializer
    // returns/is undefined
    ref.current = {
      value: typeof initialValue === 'function' ? (initialValue as Function)() : initialValue,
    };
  }
  return ref.current.value;
}
/** Updater callbacks returned by `useBoolean`. */
export interface IUseBooleanCallbacks {
  /** Set the value to true. Always has the same identity. */
  setTrue: () => void;
  /** Set the value to false. Always has the same identity. */
  setFalse: () => void;
  /** Toggle the value. Always has the same identity. */
  toggle: () => void;
}

/**
 * Hook to store a value and generate callbacks for setting the value to true or false.
 * The identity of the callbacks will always stay the same.
 *
 * @param initialState - Initial value
 * @returns Array with the current value and an object containing the updater callbacks.
 */
export function useBoolean(initialState: boolean): [boolean, IUseBooleanCallbacks] {
  const [value, setValue] = React.useState(initialState);

  const setTrue = useConst(() => () => {
    setValue(true);
  });
  const setFalse = useConst(() => () => {
    setValue(false);
  });
  const toggle = useConst(() => () => {
    setValue(currentValue => !currentValue);
  });

  return [value, { setTrue, setFalse, toggle }];
}
