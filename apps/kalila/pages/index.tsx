import styles from './index.module.scss';
import {signIn, signOut} from "next-auth/react"
import {useKalilaSession} from "@frontend/shared-ui-layout";
import {clientPromise} from "@frontend/server-side-queries";

export function Index({isConnected}) {
  const {session} = useKalilaSession()

  console.log({session})
  console.log({isConnected})

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
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    await clientPromise
    return {
      props: {isConnected: true},
    }
  } catch (e) {
    console.error(e)
    return {
      props: {isConnected: false},
    }
  }
}
