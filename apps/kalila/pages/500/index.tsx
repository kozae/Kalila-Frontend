import { kalilaTheme, useNavbarMessage } from '@frontend/shared-ui';

export function Error() {
  useNavbarMessage(
    ['Server Error', undefined],
    kalilaTheme.palette.warning.main
  );
  return (
    <div>
      <h1>Sorry, Something went wrong! Please report.</h1>
    </div>
  );
}

export default Error;
