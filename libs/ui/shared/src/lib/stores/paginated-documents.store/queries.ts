import useSWRImmutable from "swr/immutable";
import {fetcher, MediaTypes} from "@frontend/util";
import {NextRouter} from "next/router";
import useSWR from "swr";
import {KalilaDocument} from "@frontend/domain";

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

export function getDocuments<T extends KalilaDocument>(accessToken: string | undefined | null, activityName: string, schema: any, {query}: NextRouter) {
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
