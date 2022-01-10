import styles from './index.module.scss';
import {signIn, signOut} from "next-auth/react"
import {useKalilaSession} from "@frontend/shared-ui";


export function Index() {
  const {session, status} = useKalilaSession();
  if (session) {
    return (
      <>
        <h1>
          Signed in as {session.user.email}
        </h1>
        <br/>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default Index;
