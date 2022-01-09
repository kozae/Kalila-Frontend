import styles from './index.module.scss';
import {signIn, signOut} from "next-auth/react"
import {useKalilaSession} from "@frontend/shared-ui-layout";
import {queryServerSide, sigla} from "@frontend/server-side-queries";


export function Index({sigla}) {
  const {session} = useKalilaSession()

  console.log({session})
  console.log({sigla})


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

export async function getServerSideProps(context) {
  return {
    props: await queryServerSide({sigla})
  }
}
