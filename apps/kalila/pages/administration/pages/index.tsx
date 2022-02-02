import {withAdminLayout} from "@frontend/ui/administration";
import {queryServerSide, sigla} from "@frontend/server-side-queries";
import {MessageBar} from "@fluentui/react";
import styles from './pages.module.scss'
import {SiglumSelection} from "@frontend/shared-ui";
import {useRouter} from "next/router";

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

export async function getServerSideProps() {

  const query = await queryServerSide({sigla})

  return {
    props: {
      ...query
    },
  }
}

export default withAdminLayout(MSSelection, 'key2');
;
