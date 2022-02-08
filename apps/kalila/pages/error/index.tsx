import { themeColors, useNavbarMessage } from '@frontend/shared-ui';

export function Error() {
  useNavbarMessage(['Something went wrong', undefined], themeColors.warningRed);
  return (
    <div>
      <h1>Welcome to error page!</h1>
    </div>
  );
}

export default Error;
