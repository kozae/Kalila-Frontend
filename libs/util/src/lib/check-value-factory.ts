import axios from "axios";

export function checkStringValueFactory(activityName: string, fieldName: string) {
  return (value: any) => {
    return axios.get<boolean>(`/server/api/v1/${activityName}/Check`, {
      params: {
        [`${fieldName}Sw`]: value,
        [`${fieldName}Ew`]: value,
      }
    }).then(r => !r.data)
  }
}
