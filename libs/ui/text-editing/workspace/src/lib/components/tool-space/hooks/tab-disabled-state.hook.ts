import { useContext, useMemo } from 'react';
import { TextEditingWorkspaceContext } from '../../../text-editing-workspace-context';

export function useTabDisabledState() {
  const { selectedElementId } = useContext(TextEditingWorkspaceContext);
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
