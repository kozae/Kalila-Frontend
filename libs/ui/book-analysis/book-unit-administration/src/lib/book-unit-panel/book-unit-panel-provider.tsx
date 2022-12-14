import { BookUnitPanel } from './components/book-unit-panel';
import { AuxiliarySurfacesProvider } from './contexts/auxiliary-surfaces.context';
import { DataProvider } from './contexts/data.context';
import { UIOptionsProvider } from './contexts/ui-options.context';
import { IBookUnitPanelProps } from './models';

export const BookUnitPanelProvider = ({
  accessMode,
  verticalAnimate,
  ...dataProps
}: IBookUnitPanelProps) => {
  return (
    <UIOptionsProvider {...{ accessMode, verticalAnimate }}>
      <DataProvider {...dataProps}>
        <AuxiliarySurfacesProvider>
          <BookUnitPanel />
        </AuxiliarySurfacesProvider>
      </DataProvider>
    </UIOptionsProvider>
  );
};
