import styles from './index.module.scss';
import {NextPage} from "next";
import Alert from '@mui/material/Alert';
import {withAdminLayout} from "@frontend/ui/administration";


const Administration: NextPage = () => {
  return (<Alert severity="info" className={styles['info']}>
    Select one of the activities above to do administrative tasks
  </Alert>);
}

export default withAdminLayout(Administration, undefined)
