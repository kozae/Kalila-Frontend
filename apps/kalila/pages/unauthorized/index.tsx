import './index.module.scss';
import { themeColors, useNavbarMessage } from '@frontend/shared-ui';

/* eslint-disable-next-line */
export interface UnauthorizedProps {}

export function Unauthorized(props: UnauthorizedProps) {
  useNavbarMessage(['Unauthorized', undefined], themeColors.warningRed);
  return (
    <div>
      <h1>Welcome to Unauthorized!</h1>
    </div>
  );
}

export default Unauthorized;
