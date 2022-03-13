import { ActivitySchema } from '@frontend/util';
import { useAppDispatch } from '../hooks';
import { addFields, clearFields } from './fields';
import { addAttributes, clearAttributes, IAttribute } from './attributes';
import { useEffect } from 'react';

export function useSchemaStore(activityName: string, schema: ActivitySchema) {
  const dispatch = useAppDispatch();
  dispatch(addFields(schema.Fields));
  const attributes: IAttribute[] = Object.entries(
    schema.CategoricalAttributes
  ).map(([field, options]) => ({
    DocAndField: `${activityName}.${field}`,
    Field: field,
    Options: options,
  }));
  dispatch(addAttributes(attributes));
  useEffect(() => {
    return () => {
      dispatch(clearFields());
      dispatch(clearAttributes());
    };
  }, []);
}
