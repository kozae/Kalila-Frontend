import { FC, ReactNode } from 'react';
import {
  BehaviorOptionsProvider,
  DataProvider,
  LayoutOptionsProvider,
  SearchProvider,
} from './contexts';
import {
  IEditionPageAppOptionMutators,
  IEditionPageAppOptions,
  IEditionPageData,
  IEditionPageDataMutators,
  IRealTimeUpdateProps,
} from './models';

export type EditionPageProps = IEditionPageData & {
  realTime: IRealTimeUpdateProps;
} & IEditionPageDataMutators &
  IEditionPageAppOptions &
  IEditionPageAppOptionMutators;

export const EditionPageProvider: FC<
  { children: ReactNode } & EditionPageProps
> = ({ children, ...props }) => {
  const {
    edition,
    rows,
    cells,
    setRows,
    setEdition,
    setCells,
    realTime,
    ...layoutOptions
  } = props;
  const dataProps = {
    edition,
    rows,
    cells,
    setRows,
    setEdition,
    setCells,
    realTime,
  };
  return (
    <LayoutOptionsProvider {...layoutOptions}>
      <BehaviorOptionsProvider>
        <DataProvider {...dataProps}>
          <SearchProvider>{children}</SearchProvider>
        </DataProvider>
      </BehaviorOptionsProvider>
    </LayoutOptionsProvider>
  );
};
