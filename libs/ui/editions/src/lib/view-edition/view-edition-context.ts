import { createContext } from 'react';

export interface IViewEditionContext {
  numberOfDocs: number;
}

export const ViewEditionContext = createContext<IViewEditionContext>({
  numberOfDocs: 1,
});
