import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  IAuxiliarySurfacesData,
  IAuxiliarySurfacesMethods,
  IPagePreviewData,
  ILinePreviewData,
  IImagePreviewData,
} from '../models';

export const AuxiliarySurfacesDataContext =
  createContext<IAuxiliarySurfacesData>({
    activePagePreview: null,
    activeImagePreview: null,
    activeLinePreview: null,
    activeUnitPreview: null,
    visibleHorizontalTextCollation: null,
    visibleImageCollation: null,
    showSearchHints: false,
  });

export const AuxiliarySurfacesMethodsContext =
  createContext<IAuxiliarySurfacesMethods>({
    setActivePagePreview: (
      v:
        | IPagePreviewData
        | null
        | ((v: IPagePreviewData | null) => IPagePreviewData | null)
    ) => {},
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
    setActiveUnitPreview: (
      v:
        | [number, number, number]
        | null
        | ((
            v: [number, number, number] | null
          ) => [number, number, number] | null)
    ) => {},
    setVisibleHorizontalTextCollation: (
      v: number | null | ((v: number | null) => number | null)
    ) => {},
    setVisibleImageCollation: (
      v: number | null | ((v: number | null) => number | null)
    ) => {},
    setShowSearchHints: (v: boolean | ((v: boolean) => boolean)) => {},
  });

export const useAuxiliarySurfacesData = () =>
  useContext(AuxiliarySurfacesDataContext);
export const useAuxiliarySurfacesMethods = () =>
  useContext(AuxiliarySurfacesMethodsContext);

export const AuxiliarySurfacesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activePagePreview, setActivePagePreview] =
    useState<IPagePreviewData | null>(null);
  const [activeLinePreview, setActiveLinePreview] =
    useState<ILinePreviewData | null>(null);
  const [activeImagePreview, setActiveImagePreview] =
    useState<IImagePreviewData | null>(null);
  const [activeUnitPreview, setActiveUnitPreview] = useState<
    [number, number, number] | null
  >(null);
  const [visibleHorizontalTextCollation, setVisibleHorizontalTextCollation] =
    useState<number | null>(null);
  const [visibleImageCollation, setVisibleImageCollation] = useState<
    number | null
  >(null);
  const [showSearchHints, setShowSearchHints] = useState<boolean>(false);

  const data = useMemo(
    () => ({
      activeLinePreview,
      activeImagePreview,
      activeUnitPreview,
      visibleHorizontalTextCollation,
      visibleImageCollation,
      activePagePreview,
      showSearchHints,
    }),
    [
      activeLinePreview,
      activeImagePreview,
      activeUnitPreview,
      visibleHorizontalTextCollation,
      visibleImageCollation,
      activePagePreview,
      showSearchHints,
    ]
  );

  return (
    <AuxiliarySurfacesMethodsContext.Provider
      value={{
        setActiveLinePreview,
        setActiveImagePreview,
        setActiveUnitPreview,
        setVisibleHorizontalTextCollation,
        setVisibleImageCollation,
        setActivePagePreview,
        setShowSearchHints,
      }}
    >
      <AuxiliarySurfacesDataContext.Provider value={data}>
        {children}
      </AuxiliarySurfacesDataContext.Provider>
    </AuxiliarySurfacesMethodsContext.Provider>
  );
};
