import {useNavbarMessage, withTransition} from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface EditionsProps {}

export function EditManuscriptDescription(props: EditionsProps) {
  useNavbarMessage(['Manuscript Description:', 'Edit Document']);
  return (
    <div>
      <h1>Welcome to Edit Manuscript Description!</h1>
    </div>
  );
}

export default withTransition(EditManuscriptDescription, {});
