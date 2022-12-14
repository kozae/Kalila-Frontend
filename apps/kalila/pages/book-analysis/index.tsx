import './index.module.scss';
import { useNavbarMessage, withTransition } from '@frontend/kalila/components';
import { useMemo } from 'react';

/* eslint-disable-next-line */
export interface BookAnalysisProps {}

export function BookAnalysis(props: BookAnalysisProps) {
  const messages = useMemo(
    () => ['Book Analysis:', 'Select Tool'] as [string, string],
    []
  );
  useNavbarMessage(messages);
  return (
    <div>
      <h1>Welcome to BookAnalysis!</h1>
    </div>
  );
}

export default withTransition(BookAnalysis, {});
