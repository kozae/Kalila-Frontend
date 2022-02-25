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
  accessMode: AccessMode;
  activeWorkspace: ActiveWorkspace;
  loading: boolean;
  activeElement: ITextElement | IImageElement | null;
  selectedElementId: string | null;
  regionUnderEditUrl: string | null;
  setRegionUnderEditUrl: (url: string | null) => void;
  onElementSelected: (id: string | null) => void;
  setActiveWorkspace: (v: ActiveWorkspace) => void;
  onElementActivated: (element: ITextElement | IImageElement | null) => void;
  toolSpaceContainerRef?: MutableRefObject<null>;
}

const initialValue: ITextEditingWorkspaceContextValue = {
  activeWorkspace: 'description',
  accessMode: 'view',
  loading: true,
  activeElement: null,
  selectedElementId: null,
  regionUnderEditUrl: null,
  setRegionUnderEditUrl: (url: string | null) => {},
  onElementSelected: (id: string | null) => {},
  setActiveWorkspace: (v: ActiveWorkspace) => {},
  onElementActivated: (element: ITextElement | IImageElement | null) => {},
};

export function useTextEditingWorkspaceContext(): ITextEditingWorkspaceContextValue {
  const toolSpaceContainerRef = useRef(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [activeElement, onElementActivated] = useState<
    ITextElement | IImageElement | null
  >(null);
  const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspace>(
    initialValue.activeWorkspace
  );
  const [accessMode, setAccessMode] = useState<AccessMode>(
    initialValue.accessMode
  );
  const [regionUnderEditUrl, setRegionUnderEditUrl] = useState<string | null>(
    null
  );
  const editor = useAppSelector(selectPageEditor);
  const loggedUser = useAppSelector(selectUser);

  useEffect(() => {
    if (editor === loggedUser.username) {
      setAccessMode('edit');
    } else {
      setAccessMode('view');
    }
  }, [editor, loggedUser.username]);

  return {
    toolSpaceContainerRef,
    activeWorkspace,
    accessMode,
    activeElement,
    setActiveWorkspace,
    loading: useAppSelector(selectPageDataLoadingStatus),
    onElementActivated,
    selectedElementId,
    onElementSelected: setSelectedElementId,
    regionUnderEditUrl,
    setRegionUnderEditUrl,
  };
}

export const TextEditingWorkspaceContext =
  createContext<ITextEditingWorkspaceContextValue>(initialValue);
