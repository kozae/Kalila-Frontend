import { IImageElement, ITextElement } from '@frontend/domain';
import { createContext } from 'react';

export interface ILayoutAnalysisToolContext {
  onElementHovered: (element: ITextElement | IImageElement | null) => void;
}

const layoutAnalysisToolContextInit: ILayoutAnalysisToolContext = {
  onElementHovered: (element: ITextElement | IImageElement | null) => {},
};

export function useLayoutAnalysisToolContext() {}

export const LayoutAnalysisToolContext =
  createContext<ILayoutAnalysisToolContext>(layoutAnalysisToolContextInit);
