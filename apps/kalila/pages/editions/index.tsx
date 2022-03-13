import {useNavbarMessage, withTransition} from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface EditionsProps {}

export function Editions(props: EditionsProps) {
  useNavbarMessage(['Select Edition', undefined]);
  return (
    <div>
      <h1>Welcome to Editions!</h1>
    </div>
  );
}

export default withTransition(Editions, {});
