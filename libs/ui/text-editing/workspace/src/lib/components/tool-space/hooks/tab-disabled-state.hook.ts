import { useMemo } from 'react';
import {
  selectPageHasLines,
  selectPageHasText,
  selectSelectedElement,
  selectWorkspaceHasChanges,
  selectPageHasTranscription,
  useAppSelector,
  selectTextEditingToolMode,
  selectPageFacsimileUrl,
} from '@frontend/shared-ui';
import { stringHasValue } from '@frontend/util';

export function useTabDisabledState() {
  const url = useAppSelector(selectPageFacsimileUrl);
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
  const hasUrl = stringHasValue(url);
  return {
    description:
      toolMode !== 'default' || selectionIsActive || workspaceHasChanges,
    layout:
      !hasUrl ||
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges,
    lines:
      !hasUrl ||
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasText,
    transcription:
      !hasUrl ||
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasLines,
    segmentation:
      !hasUrl ||
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasTranscription,
  };
}
