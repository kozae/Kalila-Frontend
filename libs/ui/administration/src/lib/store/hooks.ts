import {useApiClient, useKalilaSession, useRegisteredEditors} from "@frontend/shared-ui";
import axios from "axios";
import {useEffect, useState} from "react";

function useLoggedUserState() {
  const {session, status} = useKalilaSession();
  return session?.user?.name;
}

export function useAdminDocuments(activityName: string) {
  const {apiClient} = useApiClient(axios)

  const [documents, setDocuments] = useState<{ [key: string]: any }[]>([])

  useEffect(() => {

    apiClient.get(`/server/api/v1/${activityName}`)
      .then(r => {
        console.log(r)
      })

  }, [activityName])

}

export function useAdminState() {
  const loggedUser = useLoggedUserState();
  const editors = useRegisteredEditors();
}
