import { useMemo } from 'react';
import {
  selectPageHasLines,
  selectPageHasText,
  selectSelectedElement,
  selectWorkspaceHasChanges,
  selectPageHasTranscription,
  useAppSelector,
} from '@frontend/shared-ui';

export function useTabDisabledState() {
  const selectedElement = useAppSelector(selectSelectedElement);
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  const pageHasLines = useAppSelector(selectPageHasLines);
  const pageHasText = useAppSelector(selectPageHasText);
  const pageHasTranscription = useAppSelector(selectPageHasTranscription);
  const selectionIsActive = useMemo(
    () => selectedElement.id !== null,
    [selectedElement.id]
  );
  return {
    description: selectionIsActive || workspaceHasChanges,
    layout: selectionIsActive || workspaceHasChanges,
    lines: selectionIsActive || workspaceHasChanges || !pageHasText,
    transcription: selectionIsActive || workspaceHasChanges || !pageHasLines,
    segmentation:
      selectionIsActive || workspaceHasChanges || !pageHasTranscription,
  };
}
