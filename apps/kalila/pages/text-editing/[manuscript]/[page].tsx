import { useNavbarMessage, withTransition } from '@frontend/shared-ui';

export function EditPage() {
  useNavbarMessage(['Text Editing:', 'Select a Manuscript']);
  return (
    <div>
      <h1>Welcome to Pages!</h1>
    </div>
  );
}

export default withTransition(EditPage, {});
