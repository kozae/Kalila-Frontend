import './index.module.scss';
import {kalilaTheme, useNavbarMessage} from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface UnauthorizedProps {}

export function Unauthorized(props: UnauthorizedProps) {
  useNavbarMessage(
    ['Unauthorized', undefined],
    kalilaTheme.palette.warning.main
  );
  return (
    <div>
      <h1>Welcome to Unauthorized!</h1>
    </div>
  );
}

export default Unauthorized;
