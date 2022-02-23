import {
  createContext,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  selectUser,
  selectPageDataLoadingStatus,
  selectPageEditor,
  useAppSelector,
} from '@frontend/shared-ui';
import { IImageElement, ITextElement } from '@frontend/domain';

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
  hoveredElement: ITextElement | IImageElement | null;
  setActiveWorkspace: (v: ActiveWorkspace) => void;
  onElementHovered: (element: ITextElement | IImageElement | null) => void;
  toolSpaceContainerRef?: MutableRefObject<null>;
}

const initialValue: ITextEditingWorkspaceContextValue = {
  activeWorkspace: 'description',
  mode: 'view',
  loading: true,
  hoveredElement: null,
  setActiveWorkspace: (v: ActiveWorkspace) => {},
  onElementHovered: (element: ITextElement | IImageElement | null) => {},
};

export function useTextEditingWorkspaceContext(): ITextEditingWorkspaceContextValue {
  const toolSpaceContainerRef = useRef(null);
  const [hoveredElement, onElementHovered] = useState<
    ITextElement | IImageElement | null
  >(null);
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
    toolSpaceContainerRef,
    activeWorkspace,
    mode,
    hoveredElement,
    setActiveWorkspace,
    loading: useAppSelector(selectPageDataLoadingStatus),
    onElementHovered,
  };
}

export const TextEditingWorkspaceContext =
  createContext<ITextEditingWorkspaceContextValue>(initialValue);
