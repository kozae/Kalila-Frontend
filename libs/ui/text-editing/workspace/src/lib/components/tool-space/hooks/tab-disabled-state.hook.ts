import { useMemo } from 'react';
import { selectSelectedElementId, useAppSelector } from '@frontend/shared-ui';

export function useTabDisabledState() {
  const selectedElementId = useAppSelector(selectSelectedElementId);
  const selectionIsActive = useMemo(
    () => selectedElementId !== null,
    [selectedElementId]
  );
  return {
    description: selectionIsActive,
    layout: selectionIsActive,
    lines: selectionIsActive,
    transcription: selectionIsActive,
    segmentation: selectionIsActive,
  };
}
