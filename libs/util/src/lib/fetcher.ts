import axios from "axios";
import {MediaTypes} from "./media-types";
import {getPagination} from "./pagination-header";

export function fetcher(controller: string, accessToken: string, query: Record<string, any> = {}, accept: string | MediaTypes = "application/json") {
  if (accessToken) {
    return axios.get(`/server/api/v1/${controller}`, {
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

  return Promise.resolve({content: {}, pagination: {}});
}

