import axios from 'axios';

interface ICategoricalAttribute {
  EntityName: string;
  FieldName: string;
}

export function checkStringValueFactory(
  activityName: string,
  fieldName: string
) {
  return (value: any) => {
    return axios
      .get<boolean>(`/server/api/v1/${activityName}/Check`, {
        params: {
          [`${fieldName}Sw`]: value,
          [`${fieldName}Ew`]: value,
        },
      })
      .then((r) => !r.data);
  };
}

export function checkNumberValueFactory(
  activityName: string,
  fieldName: string,
  additionalParams: any = {}
) {
  return (value: any) => {
    return axios
      .get<boolean>(`/server/api/v1/${activityName}/Check`, {
        params: {
          [`${fieldName}Eq`]: value,
          ...additionalParams,
        },
      })
      .then((r) => !r.data);
  };
}

export async function checkOptionDuplication(
  newOption: string,
  { EntityName, FieldName }: ICategoricalAttribute
) {
  return axios
    .get<boolean>('/server/api/v1/CategoricalAttribute/Check', {
      params: {
        OptionEq: newOption,
        EntityNameEq: EntityName,
        FieldNameEq: FieldName,
      },
    })
    .then((r) => !r.data);
}
