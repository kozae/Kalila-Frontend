import { FC, ReactNode } from 'react';
import {
  AuxiliarySurfacesProvider,
  BehaviorOptionsProvider,
  DataProvider,
  LayoutDataProvider,
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
    editOnDoubleClick,
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
    <AuxiliarySurfacesProvider>
      <BehaviorOptionsProvider editOnDoubleClick={editOnDoubleClick}>
        <DataProvider {...dataProps}>
          <LayoutDataProvider {...layoutOptions}>
            <SearchProvider>{children}</SearchProvider>
          </LayoutDataProvider>
        </DataProvider>
      </BehaviorOptionsProvider>
    </AuxiliarySurfacesProvider>
  );
};
