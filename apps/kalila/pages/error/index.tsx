import { kalilaTheme, useNavbarMessage } from '@frontend/shared-ui';

export function Error() {
  useNavbarMessage(
    ['Something went wrong', undefined],
    kalilaTheme.palette.warning.main
  );
  return (
    <div>
      <h1>Welcome to error page!</h1>
    </div>
  );
}

export default Error;
