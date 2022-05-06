import {
  KalilaLogo,
  useNavbarMessage,
  withTransition,
} from '@frontend/shared-ui';

export function Index() {
  useNavbarMessage(['Home', undefined]);

  return (
    <div style={{ padding: '1rem', minWidth: '200px' }}>
      <KalilaLogo />
    </div>
  );
}

export default withTransition(Index, {});
