import { useMemo } from 'react';
import {
  selectPageHasLines,
  selectPageHasText,
  selectPageHasTranscription,
  selectSelectedElement,
  selectTextEditingToolMode,
  selectWorkspaceHasChanges,
  useAppSelector,
} from '@frontend/shared-ui';

export function useTabDisabledState() {
  const selectedElement = useAppSelector(selectSelectedElement);
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  const pageHasLines = useAppSelector(selectPageHasLines);
  const pageHasText = useAppSelector(selectPageHasText);
  const pageHasTranscription = useAppSelector(selectPageHasTranscription);
  const selectionIsActive = useMemo(
    () => selectedElement.id !== null,
    [selectedElement.id]
  );
  return {
    description:
      toolMode !== 'default' || selectionIsActive || workspaceHasChanges,
    layout: toolMode !== 'default' || selectionIsActive || workspaceHasChanges,
    lines:
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasText,
    transcription:
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasLines,
    segmentation:
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasTranscription,
  };
}
