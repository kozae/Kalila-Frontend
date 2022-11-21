import { createContext } from 'react';

export interface ITextSegmentationContext {
  updateTime: number;
  hoveredUnit: string | undefined;
  setUpdateTime: (v: number) => void;
  setHoveredUnit: (v: string | undefined) => void;
}

export const TextSegmentationContext = createContext<ITextSegmentationContext>({
  updateTime: 0,
  hoveredUnit: undefined,
  setUpdateTime: (v) => {},
  setHoveredUnit: (v: string | undefined) => {},
});
