export interface ITextEditingWorkspaceContextValue {
  mode: 'view' | 'edit';
  activeWorkspace:
    | 'description'
    | 'transcription'
    | 'layout'
    | 'lines'
    | 'segmentation';
}
