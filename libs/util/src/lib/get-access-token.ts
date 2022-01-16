import useSWR from "swr";
import {getSession} from "next-auth/react";

export function getAccessToken() {
  const {data} = useSWR('accessToken', getSession)
  if (data !== null) {
    return data['access']
  }
  return undefined
}
