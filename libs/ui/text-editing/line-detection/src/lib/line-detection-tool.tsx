import { selectAllLines, useAppSelector } from '@frontend/shared-ui';
import { SemiAutomatedLineDetector } from './semi-automated-line-detector';

export const LineDetectionTool = () => {
  const lines = useAppSelector(selectAllLines);

  if (lines.length === 0) return <SemiAutomatedLineDetector />;
  return <SemiAutomatedLineDetector />;
};
