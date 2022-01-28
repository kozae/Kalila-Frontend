import {KeyedMutator} from "swr";
import {IPagination} from "@frontend/util";
import axios from "axios";
import {IRealTimeUpdate} from "@frontend/shared-ui";

type Mutator = KeyedMutator<{ content: any[], pagination: IPagination | undefined }>

export function createDocumentFactory<T extends object>(accessToken: string, activityName: string) {
  return async (doc: T) => {
    await axios.post(`/server/api/v1/${activityName}`, doc,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
  }
}

export function processSignalRUpdateFactory(mutateDocs: Mutator, mutateSchema: Mutator, activityName: string) {
  return async (update: IRealTimeUpdate) => {
    if (update) {
      if (update.Topic.endsWith(activityName)) {
        await mutateDocs(); // triggers another request to the backend
        return;
      }
      if (activityName === 'CategoricalAttribute' && update.Topic.endsWith(activityName)) {
        await mutateDocs();
        return;
      }
      if (activityName !== 'CategoricalAttribute' && update.Topic.endsWith('CategoricalAttribute')) {
        await mutateSchema();
      }
    }

  }
}

export function updateDocumentFactory(accessToken: string, activityName: string) {
  return async (update: { [key: string]: any }, params: { [key: string]: any }) => {
    await axios.patch(`/server/api/v1/${activityName}/Admin`, update,
      {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
  }
}

export function deleteDocumentFactory(accessToken: string, activityName: string) {
  return async (id: string) => {
    await axios.delete(`/server/api/v1/${activityName}`, {
      params: {Id: id},
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

}


