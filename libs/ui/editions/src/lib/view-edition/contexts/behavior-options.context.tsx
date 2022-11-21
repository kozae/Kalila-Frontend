import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  IBehaviorOptions,
  IBehaviorOptionsMethods,
  MapPosition,
} from '../models';

export const BehaviorOptionsContext = createContext<IBehaviorOptions>({
  enableFacsimilePreview: false,
  isSearchActive: false,
  enableRealTimeUpdates: false,
  mapState: null,
  visibleUnitInfo: null,
});

export const BehaviorOptionMethodsContext =
  createContext<IBehaviorOptionsMethods>({
    setEnableFacsimilePreview: (v: boolean | ((v: boolean) => boolean)) => {},
    setIsSearchActive: (v: boolean | ((v: boolean) => boolean)) => {},
    setEnableRealTimeUpdates: (v: boolean | ((v: boolean) => boolean)) => {},
    setVisibleUnitInfo: (
      v: (number | null) | ((v: number | null) => number | null)
    ) => {},
    setMapState: (
      v: MapPosition | null | ((v: MapPosition | null) => MapPosition | null)
    ) => {},
  });

export const useBehaviorOptions = () => useContext(BehaviorOptionsContext);
export const useBehaviorOptionsMethods = () =>
  useContext(BehaviorOptionMethodsContext);

export const BehaviorOptionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [enableFacsimilePreview, setEnableFacsimilePreview] =
    useState<boolean>(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [enableRealTimeUpdates, setEnableRealTimeUpdates] =
    useState<boolean>(true);

  const [mapState, setMapState] = useState<MapPosition | null>(null);
  const [visibleUnitInfo, setVisibleUnitInfo] = useState<number | null>(null);
  const options = useMemo(
    () => ({
      enableFacsimilePreview,
      isSearchActive,
      enableRealTimeUpdates,
      mapState,
      visibleUnitInfo,
    }),
    [
      enableFacsimilePreview,
      isSearchActive,
      enableRealTimeUpdates,
      mapState,
      visibleUnitInfo,
    ]
  );
  return (
    <BehaviorOptionMethodsContext.Provider
      value={{
        setEnableFacsimilePreview,
        setIsSearchActive,
        setEnableRealTimeUpdates,
        setMapState,
        setVisibleUnitInfo,
      }}
    >
      <BehaviorOptionsContext.Provider value={options}>
        {children}
      </BehaviorOptionsContext.Provider>
    </BehaviorOptionMethodsContext.Provider>
  );
};
