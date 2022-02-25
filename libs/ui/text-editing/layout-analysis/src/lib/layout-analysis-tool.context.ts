import { IImageElement, ITextElement } from '@frontend/domain';
import { createContext } from 'react';

export interface ILayoutAnalysisToolContext {
  onElementActivated: (element: ITextElement | IImageElement | null) => void;
  selectedElementId: string | null;
  onElementSelected: (id: string | null) => void;
  regionUnderEditUrl: string | null;
}

const layoutAnalysisToolContextInit: ILayoutAnalysisToolContext = {
  onElementActivated: (element: ITextElement | IImageElement | null) => {},
  selectedElementId: null,
  onElementSelected: (id: string | null) => {},
  regionUnderEditUrl: null,
};

export function useLayoutAnalysisToolContext() {}

export const LayoutAnalysisToolContext =
  createContext<ILayoutAnalysisToolContext>(layoutAnalysisToolContextInit);
