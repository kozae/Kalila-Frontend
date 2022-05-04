import { createContext } from 'react';

export interface ITextSegmentationContext {
  updateTime: number;
  setUpdateTime: (v: number) => void;
}

export const TextSegmentationContext = createContext<ITextSegmentationContext>({
  updateTime: 0,
  setUpdateTime: (v) => {},
});
