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
  selectPageHasImages,
} from '@frontend/shared-ui';
import { stringHasValue } from '@frontend/util';

export function useTabDisabledState() {
  const url = useAppSelector(selectPageFacsimileUrl);
  const selectedElement = useAppSelector(selectSelectedElement);
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const workspaceHasChanges = useAppSelector(selectWorkspaceHasChanges);
  const pageHasLines = useAppSelector(selectPageHasLines);
  const pageHasText = useAppSelector(selectPageHasText);
  const pageHasImages = useAppSelector(selectPageHasImages);
  const pageHasTranscription = useAppSelector(selectPageHasTranscription);
  const selectionIsActive = useMemo(
    () => selectedElement.Id !== null,
    [selectedElement.Id]
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
    images:
      !hasUrl ||
      toolMode !== 'default' ||
      selectionIsActive ||
      workspaceHasChanges ||
      !pageHasImages,
  };
}
