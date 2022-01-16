import {withAdminLayout} from "./_layout";
import {useRouter} from "next/router";
import {useAdminPageStore} from "@frontend/ui/administration";
import {useContext, useEffect} from "react";
import {SignalrStore} from "@frontend/shared-ui";

export function MSDAdministration() {
  const router = useRouter();
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);
  const store = useAdminPageStore('ManuscriptDescription', router, update)

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
