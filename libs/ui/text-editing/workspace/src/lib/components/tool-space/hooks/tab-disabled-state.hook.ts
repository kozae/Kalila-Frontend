import { useMemo } from 'react';
import {
  selectSelectedElement,
  selectWorkspaceHasChanges,
  useAppSelector,
} from '@frontend/shared-ui';

export function useTabDisabledState() {
  const selectedElement = useAppSelector(selectSelectedElement);
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  const selectionIsActive = useMemo(
    () => selectedElement.id !== null,
    [selectedElement.id]
  );
  return {
    description: selectionIsActive || workspaceHasChanges,
    layout: selectionIsActive || workspaceHasChanges,
    lines: selectionIsActive || workspaceHasChanges,
    transcription: selectionIsActive || workspaceHasChanges,
    segmentation: selectionIsActive || workspaceHasChanges,
  };
}
