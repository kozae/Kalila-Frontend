import { useEffect, useState } from 'react';

export function useExcludedColumns(name: string, init: string[] = []) {
  const [excludedColumns, setExcludedColumns] = useState(new Set<string>(init));
  useEffect(() => {
    const stored = localStorage.getItem(`${name}_excludedColumns`);
    if (stored) {
      setExcludedColumns(new Set<string>(JSON.parse(stored)));
    }
  }, []);
  const changeExcludedColumns = (value: Set<string>) => {
    localStorage.setItem(`${name}_excludedColumns`, JSON.stringify([...value]));
    setExcludedColumns(value);
  };

  return { excludedColumns, changeExcludedColumns };
}
