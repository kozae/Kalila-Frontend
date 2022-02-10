import { useEffect, useRef, useState } from 'react';
import { stringHasValue } from '@frontend/util';

export function useFilterFieldState(
  accessor: string,
  activeFilter: Record<string, any>,
  onFilter: (newFilter: Record<string, any>) => void
) {
  const [value, setValue] = useState(activeFilter[accessor] ?? '');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setValue(activeFilter[accessor] ?? '');
    if (ref.current && stringHasValue(activeFilter[accessor])) {
      ref.current.focus();
    }
  }, [activeFilter[accessor]]);

  useEffect(() => {
    const active = activeFilter[accessor] ?? '';
    if (value !== active) {
      onFilter({ ...activeFilter, [accessor]: value });
    }
  }, [value]);

  const onChange = (e: any) => setValue(e.currentTarget.value);

  return [value, ref, onChange];
}
