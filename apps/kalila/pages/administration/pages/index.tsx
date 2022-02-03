import {withAdminLayout} from "@frontend/ui/administration";
import styles from './pages.module.scss'
import {SiglumSelection} from "@frontend/shared-ui";
import {useRouter} from "next/router";
import {queryServerSide, sigla} from "@frontend/server-side-queries";
import {GetServerSideProps} from "next";
import Alert from '@mui/material/Alert';

export function MSSelection({sigla}) {
  const {push} = useRouter()
  return (
    <>
      <Alert severity="info" className={styles['info']}>
        Click on a manuscript on which to do administrative tasks
      </Alert>
      <SiglumSelection sigla={sigla}
                       siglumClass={styles['siglum']}
                       siglaContainerClass={styles['sigla']}
                       onSelect={(s) => push(`/administration/pages/${s.id}`)}/>
    </>
  );
}


export default withAdminLayout(MSSelection, 1);

export  const getServerSideProps: GetServerSideProps  = async (context)=>{
  const query = await queryServerSide({sigla})
  return {
    props: {
      ...query
    },
  }
}

