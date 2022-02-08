import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';

export function TextEditing() {
  useNavbarMessage(['Textual Analysis', undefined]);
  return (
    <div>
      <h1>Welcome to Pages!</h1>
    </div>
  );
}

export default withTransition(TextEditing, {});
