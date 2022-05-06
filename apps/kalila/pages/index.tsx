import {
  KalilaLogo,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';
import { useEffect } from 'react';

export function Index() {
  useNavbarMessage(['Home', undefined]);

  useEffect(() => {
    import('../lib/pkg').then(({ start }) => {
      start();
    });
  }, []);

  return (
    <div style={{ padding: '1rem', minWidth: '200px' }}>
      {/*<KalilaLogo />*/}
      <canvas id="canvas" tabIndex={0} height="600" width="600">
        Your browser does not support the canvas.
      </canvas>
    </div>
  );
}

export default withTransition(Index, {});
