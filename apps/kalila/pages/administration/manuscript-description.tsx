import {useRouter} from "next/router";
import {useAdminPageStore, withAdminLayout} from "@frontend/ui/administration";
import {useContext, useEffect} from "react";
import {SignalrStore} from "@frontend/shared-ui";

export function MSDAdministration() {
  const router = useRouter();
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);
  const store = useAdminPageStore('ManuscriptDescription', router, update)

  useEffect(() => {
    console.log({docs: store.state.documents})
    console.log({pagination: store.state.pagination})
  }, [store.state.documents])

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup('ManuscriptDescription', connection)
        .then(() => console.log('ManuscriptDescription group joined'))
    }
  }, [isConnected, connection])

  return (
    <>
      <h1>Welcome to MSD Administration!</h1>
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
