import { createContext, useEffect, useState } from 'react';
import {
  selectUser,
  selectPageDataLoadingStatus,
  selectPageEditor,
  useAppSelector,
} from '@frontend/shared-ui';

export type ActiveWorkspace =
  | 'description'
  | 'transcription'
  | 'layout'
  | 'lines'
  | 'segmentation';

export type AccessMode = 'view' | 'edit';

export interface ITextEditingWorkspaceContextValue {
  mode: AccessMode;
  activeWorkspace: ActiveWorkspace;
  loading: boolean;
  setActiveWorkspace: (v: ActiveWorkspace) => void;
}

const initialValue: ITextEditingWorkspaceContextValue = {
  activeWorkspace: 'description',
  mode: 'view',
  loading: true,
  setActiveWorkspace: (v: ActiveWorkspace) => {},
};

export function useTextEditingWorkspaceContext(): ITextEditingWorkspaceContextValue {
  const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspace>(
    initialValue.activeWorkspace
  );
  const [mode, setMode] = useState<AccessMode>(initialValue.mode);
  const editor = useAppSelector(selectPageEditor);
  const loggedUser = useAppSelector(selectUser);

  useEffect(() => {
    if (editor === loggedUser.username) {
      setMode('edit');
    } else {
      setMode('view');
    }
  }, [editor, loggedUser.username]);

  return {
    activeWorkspace,
    mode,
    setActiveWorkspace,
    loading: useAppSelector(selectPageDataLoadingStatus),
  };
}

export const TextEditingWorkspaceContext =
  createContext<ITextEditingWorkspaceContextValue>(initialValue);
