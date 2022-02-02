import {withAdminLayout} from "@frontend/ui/administration";
import {MessageBar} from "@fluentui/react";
import styles from './pages.module.scss'
import {SiglumSelection} from "@frontend/shared-ui";
import {useRouter} from "next/router";
import {queryServerSide, sigla} from "@frontend/server-side-queries";
import {GetServerSideProps} from "next";

export function MSSelection({sigla}) {
  const {push} = useRouter()
  return (
    <>
      <MessageBar className={styles['info']}>
        Click on a manuscript on which to do administrative tasks
      </MessageBar>
      <SiglumSelection sigla={sigla}
                       siglumClass={styles['siglum']}
                       siglaContainerClass={styles['sigla']}
                       onSelect={(s) => push(`/administration/pages/${s.id}`)}/>
    </>
  );
}


export default withAdminLayout(MSSelection, 'key2');

export  const getServerSideProps: GetServerSideProps  = async (context)=>{
  const query = await queryServerSide({sigla})
  return {
    props: {
      ...query
    },
  }
}

