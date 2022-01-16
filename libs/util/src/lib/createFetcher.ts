import axios from "axios";
import {MediaTypes} from "./media-types";
import {getPagination} from "./pagination-header";

export function createFetcher(accessToken: string) {
  return (url: string, query: Record<string, any> = {}, accept: string | MediaTypes = "application/json") =>
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': accept
      },
      params: query
    })
      .then(({data, headers}) => ({
        content: data,
        pagination: getPagination(headers)
      }))

}
