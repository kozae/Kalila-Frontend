import './index.module.scss';
import { kalilaTheme } from '@frontend/shared-ui';
import { useNavbarMessage } from '@frontend/kalila/components';

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
