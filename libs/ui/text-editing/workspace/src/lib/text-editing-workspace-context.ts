import { fabric } from 'fabric';
import { createContext } from 'react';

export interface ITextEditingWorkspaceContext {
  fabricImg: fabric.Image | null;
}

export const TextEditingWorkspaceContext =
  createContext<ITextEditingWorkspaceContext>({ fabricImg: null });
