import axios from "axios";
import {MediaTypes} from "./media-types";
import {getPagination} from "./pagination-header";
import {getSession} from "next-auth/react";

export async function fetcher(controller: string, query: Record<string, any> = {}, accept: string | MediaTypes = "application/json") {
  const {access} = await getSession();
  const {data, headers} = await axios.get(`/server/api/v1/${controller}`, {
    headers: {
      'Authorization': `Bearer ${access}`,
      'Accept': accept
    },
    params: query
  })
  return {content: data, pagination: getPagination(headers)}
}

