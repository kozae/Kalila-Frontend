import useSWR from "swr";
import {getSession} from "next-auth/react";
import {transformSession} from "./transform-session";

export function getSessionSWR() {
  const {data} = useSWR('accessToken', getSession)
  return transformSession(data);
}
