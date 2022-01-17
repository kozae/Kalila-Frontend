import useSWRImmutable from "swr/immutable";
import {fetcher, MediaTypes} from "@frontend/util";
import {NextRouter} from "next/router";
import useSWR from "swr";
import axios from "axios";

export function getSchema(accessToken: string | undefined | null, activityName: string) {
  return useSWRImmutable(
    accessToken ? [ // only fetch if access token is present
      `EntrySchema/${activityName}`,
      accessToken,
      {
        KeyField: true
      }
    ] : null,
    fetcher);
}

export function getDocuments(accessToken: string | undefined | null, activityName: string, schema: any, {query}: NextRouter) {
  return useSWR(
    schema && accessToken ? [ // only fetch if access token is present, after the schema is fetched
      activityName,
      accessToken,
      query,
      MediaTypes.AdminDocument
    ] : null
    , fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    })
}

export async function  documentExists(accessToken: string | undefined | null, activityName: string, params: {[key: string]: any}) {
  await axios.get(`/server/api/v1/${activityName}/Check`,
    {
      params,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
}
