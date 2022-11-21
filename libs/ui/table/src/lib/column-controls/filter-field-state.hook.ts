import { useEffect, useRef, useState } from 'react';

export function useFilterFieldState(
  accessor: string,
  activeFilter: Record<string, any>
) {
  const [value, setValue] = useState(activeFilter[accessor] ?? '');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const onChange = (e: any) => setValue(e.currentTarget.value);
  return [value, ref, onChange];
}

export function useAutoCompleteFieldState(
  accessor: string,
  activeFilter: Record<string, any>,
  defaultValue: any = ''
) {
  const [value, setValue] = useState(activeFilter[accessor] ?? defaultValue);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const onChange = (e: any) => setValue(e.target.textContent);
  return [value, ref, onChange];
}
