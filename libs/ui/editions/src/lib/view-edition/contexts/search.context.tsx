import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ISearchData, ISearchMethods, SearchResults } from '../models';

export const SearchDataContext = createContext<ISearchData>({
  filter: '',
  searchResults: null,
  currentSearchResult: 0,
});

export const SearchMethodsContext = createContext<ISearchMethods>({
  setFilter: (v: string | ((v: string) => string)) => {},
  setSearchResults: (
    v: SearchResults | ((v: SearchResults) => SearchResults)
  ) => {},
  setCurrentSearchResult: (v: number | ((v: number) => number)) => {},
});

export const useSearchData = () => useContext(SearchDataContext);
export const useSearchMethods = () => useContext(SearchMethodsContext);

export const SearchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>(null);
  const [currentSearchResult, setCurrentSearchResult] = useState<number>(0);

  const data = useMemo(
    () => ({ filter, searchResults, currentSearchResult }),
    [filter, searchResults, currentSearchResult]
  );

  return (
    <SearchMethodsContext.Provider
      value={{
        setFilter,
        setSearchResults,
        setCurrentSearchResult,
      }}
    >
      <SearchDataContext.Provider value={data}>
        {children}
      </SearchDataContext.Provider>
    </SearchMethodsContext.Provider>
  );
};
