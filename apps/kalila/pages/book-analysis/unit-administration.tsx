import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/shared-ui';
import { useMemo } from 'react';
import { BookUNitAdministrationWrapper } from '@frontend/kalila/components';

export function UnitAdministration() {
  const messages = useMemo(
    () => ['Book Analysis:', 'Unit Administration'] as [string, string],
    []
  );
  useNavbarMessage(messages);
  return <BookUNitAdministrationWrapper />;
}
export default withTransition(UnitAdministration, {});
