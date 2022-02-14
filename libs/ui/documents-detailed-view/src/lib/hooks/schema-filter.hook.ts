import { useEffect, useState } from 'react';

export function useSchemaFilter(init = {}) {
  const [schemaFilter, setSchemaFilter] = useState<Record<string, any>>(init);
  useEffect(() => {
    const stored = localStorage.getItem(
      'ManuscriptDescriptionPage_SchemaFilter'
    );
    if (stored) {
      setSchemaFilter(JSON.parse(stored));
    }
  }, []);
  const changeSchemaFilter = (value: Record<string, any>) => {
    localStorage.setItem(
      'ManuscriptDescriptionPage_SchemaFilter',
      JSON.stringify(value)
    );
    setSchemaFilter(value);
  };

  return { schemaFilter, changeSchemaFilter };
}
