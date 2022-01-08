import styles from './index.module.scss';
import {useSession, signIn, signOut} from "next-auth/react"

export function Index() {
  const {data: session, ...remaining} = useSession()
  console.log(session)
  console.log(remaining)
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br/>
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
