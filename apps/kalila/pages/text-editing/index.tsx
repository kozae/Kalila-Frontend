import './index.module.scss';
import {withTransition} from "@frontend/shared-ui";
import ManuscriptDescription from "../manuscript-description";


export function TextEditing() {
  return (
    <div>
      <h1>Welcome to Pages!</h1>
    </div>
  );
}

export default withTransition(TextEditing, {});

