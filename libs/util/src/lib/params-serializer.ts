import * as qs from 'qs';

export function paramsSerializer(params: any) {
  return qs.stringify(params);
}
