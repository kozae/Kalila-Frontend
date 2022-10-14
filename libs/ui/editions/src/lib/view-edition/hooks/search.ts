import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  intRegEx,
  latinLettersRegex,
  numberSearchRegex,
  stringHasValue,
} from '@frontend/util';
import { chunk, debounce, orderBy } from 'lodash';
import { EditionStore } from '../../store';
import { SearchResults } from '@frontend/ui/editions';
import { useData } from '../contexts';
import axios from 'axios';

export function useSearch(
  filter: string,
  edition: EditionStore,
  setSearchResults: Dispatch<SetStateAction<SearchResults>>,
  setCurrentSearchResult: Dispatch<SetStateAction<number>>
) {
  const search = useCallback(
    debounce((filter: string) => {
      let results: () => Promise<SearchResults> = async () => null;
      if (stringHasValue(filter)) {
        if (filter === ':p' || filter === ':P') {
          results = async () => doPageBreakSearch(edition);
        } else if (filter === ':i' || filter === ':I') {
          results = async () => doLocatedImageSearch(edition);
        } else if (intRegEx.test(filter)) {
          results = async () => doUnitNumberSearch(filter, edition);
        } else if (latinLettersRegex.test(filter) && filter.length > 2) {
          results = async () => doUnitTitleSearch(filter, edition);
        } else if (filter.length > 2) {
          results = async () => {
            const sentence = filter.replace(/&/g, ' ');
            const morph = await getMorphology(sentence);
            let lemmatized = filter;
            Object.keys(morph).forEach((key) => {
              lemmatized = lemmatized.replace(key, morph[key][0]);
            });
            return doTokenSearch(lemmatized, edition);
          };
        }
      }
      results().then((r) => {
        setSearchResults(r);
        setCurrentSearchResult(0);
      });
    }, 300),
    [filter]
  );

  useEffect(() => {
    search(filter);
  }, [filter]);
}

function doPageBreakSearch(edition: EditionStore) {
  let results = chunk(edition.get_page_breaks(), 4) as [
    number,
    number,
    number,
    number
  ][];
  results = orderBy(results, (r) => r[2]);
  results = orderBy(results, (r) => r[1], ['desc']);
  return orderBy(results, (r) => r[0]);
}

function doLocatedImageSearch(edition: EditionStore) {
  let results = chunk(edition.get_located_images(), 4) as [
    number,
    number,
    number,
    number
  ][];
  results = orderBy(results, (r) => r[2]);
  results = orderBy(results, (r) => r[1], ['desc']);
  return orderBy(results, (r) => r[0]);
}

function doUnitNumberSearch(
  filter: string,
  edition: EditionStore
): SearchResults {
  const order = parseInt(filter);
  const unitIdx = edition.find_unit_by_order(order);
  if (unitIdx) {
    return [[unitIdx, -1, -1]];
  } else return [];
}

function doUnitTitleSearch(
  filter: string,
  edition: EditionStore
): SearchResults {
  return chunk(edition.find_unit_by_title(filter.toLowerCase()), 3) as [
    number,
    number,
    number
  ][];
}

function doTokenSearch(filter: string, edition: EditionStore) {
  let phrases = [filter.trim()];
  if (filter.includes('&')) {
    phrases = filter
      .split('&')
      .map((w) => w.trim())
      .filter((w) => w.length > 2);
  }
  const results: SearchResults = [] as [number, number, number, number][];
  for (let phrase of phrases) {
    let phraseResults = chunk(edition.find_words(phrase), 4) as [
      number,
      number,
      number,
      number
    ][];
    if (phraseResults && phraseResults.length !== 0) {
      phraseResults = orderBy(phraseResults, (r) => r[2]);
      phraseResults = orderBy(phraseResults, (r) => r[1], ['desc']);
      phraseResults = orderBy(phraseResults, (r) => r[0]);
      results.push(...phraseResults);
    }
  }

  return results as SearchResults;
}

export function useAutoScrollingToResults(
  searchResults: SearchResults,
  currentSearchResult: number
) {
  const { rowVirtualizer } = useData();
  useEffect(() => {
    if (searchResults && searchResults.length !== 0) {
      const firstResult = searchResults[0][0];
      rowVirtualizer?.scrollToIndex(firstResult * 2, { align: 'start' });
    }
  }, [searchResults]);

  const memoSearchResults = useMemo(() => searchResults, [searchResults]);
  useEffect(() => {
    if (memoSearchResults) {
      const currentRow = memoSearchResults[currentSearchResult][0];
      rowVirtualizer?.scrollToIndex(currentRow * 2, { align: 'start' });
    }
  }, [currentSearchResult]);
}

async function getMorphology(sentence: string) {
  const { data } = await axios.post<Record<string, string[]>>(
    `${process.env['NEXT_PUBLIC_API_URL']}Morphology`,
    {
      Sentence: sentence,
    }
  );
  return data;
}
