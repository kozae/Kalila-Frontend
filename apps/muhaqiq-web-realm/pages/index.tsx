import { useNavbarMessage } from '@frontend/kalila/components';
import { useMemo } from 'react';

export function Index() {
  const messages = useMemo(() => ['Home', undefined] as [string, string], []);
  useNavbarMessage(messages, undefined);
  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
}

export default Index;
