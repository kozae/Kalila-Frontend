import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StructurePositions } from '../structure/render';
import {
  IBehaviorOptions,
  IBehaviorOptionsMethods,
  IImagePreviewData,
  ILinePreviewData,
} from '../models';

export const BehaviorOptionsContext = createContext<IBehaviorOptions>({
  enableFacsimilePreview: false,
  isSearchActive: false,
  activeImagePreview: null,
  activeLinePreview: null,
  enableRealTimeUpdates: false,
  structureViz: null,
});

export const BehaviorOptionMethodsContext =
  createContext<IBehaviorOptionsMethods>({
    setEnableFacsimilePreview: (v: boolean | ((v: boolean) => boolean)) => {},
    setIsSearchActive: (v: boolean | ((v: boolean) => boolean)) => {},
    setEnableRealTimeUpdates: (v: boolean | ((v: boolean) => boolean)) => {},
    setActiveLinePreview: (
      v:
        | ILinePreviewData
        | null
        | ((v: ILinePreviewData | null) => ILinePreviewData | null)
    ) => {},
    setActiveImagePreview: (
      v:
        | IImagePreviewData
        | null
        | ((v: IImagePreviewData | null) => IImagePreviewData | null)
    ) => {},
    setStructureViz: (
      v:
        | StructurePositions
        | null
        | ((v: StructurePositions | null) => StructurePositions | null)
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
  const [activeLinePreview, setActiveLinePreview] =
    useState<ILinePreviewData | null>(null);
  const [activeImagePreview, setActiveImagePreview] =
    useState<IImagePreviewData | null>(null);
  const [enableRealTimeUpdates, setEnableRealTimeUpdates] =
    useState<boolean>(true);

  const [structureViz, setStructureViz] = useState<StructurePositions | null>(
    null
  );
  const options = useMemo(
    () => ({
      enableFacsimilePreview,
      isSearchActive,
      activeLinePreview,
      activeImagePreview,
      enableRealTimeUpdates,
      structureViz,
    }),
    [
      enableFacsimilePreview,
      isSearchActive,
      activeLinePreview,
      activeImagePreview,
      enableRealTimeUpdates,
      structureViz,
    ]
  );
  return (
    <BehaviorOptionMethodsContext.Provider
      value={{
        setEnableFacsimilePreview,
        setIsSearchActive,
        setActiveLinePreview,
        setActiveImagePreview,
        setEnableRealTimeUpdates,
        setStructureViz,
      }}
    >
      <BehaviorOptionsContext.Provider value={options}>
        {children}
      </BehaviorOptionsContext.Provider>
    </BehaviorOptionMethodsContext.Provider>
  );
};
