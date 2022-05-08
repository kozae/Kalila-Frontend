import { createContext } from 'react';
import { FacsimileCropper } from '@frontend/ui/facsimile-cropper';

export interface ITextEditingWorkspaceContext {
  facsimileCropper: FacsimileCropper | null;
}

export const TextEditingWorkspaceContext =
  createContext<ITextEditingWorkspaceContext>({
    facsimileCropper: null,
  });
