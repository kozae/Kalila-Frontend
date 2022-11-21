import { ReactNode } from 'react';

export interface IChildrenProp {
  children?: ReactNode | undefined;
}

export type PropsWithChildren<P> = P & IChildrenProp;
