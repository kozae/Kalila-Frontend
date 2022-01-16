import styles from './index.module.scss';
import {NextPage} from "next";
import {MessageBar} from "@fluentui/react";
import {useRegisteredEditors} from "@frontend/shared-ui";
import {withAdminLayout} from "@frontend/ui/administration";


const Administration: NextPage = () => {
  useRegisteredEditors();
  return (<MessageBar className={styles['info']}>
    Select one of the activities above to do administrative tasks
  </MessageBar>);
}

export default withAdminLayout(Administration, undefined)
