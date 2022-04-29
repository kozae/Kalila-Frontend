import React, { useEffect, useState } from 'react';
import { getBookUnits, IBookUnitQuery } from '../queries';
import { debounce } from 'lodash';
import { IChapter } from '@frontend/domain';

export function useBookUnits(
  chapter: IChapter | null,
  accessToken: string | null
) {
  const [filter, setFilter] = useState<string>('');
  const [bookUnitQuery, setBookUnitQuery] = useState<IBookUnitQuery>({
    PageNumber: 1,
    TitleCn: '',
  });
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setBookUnitQuery((oldQuery) => ({ ...oldQuery, PageNumber: value }));
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFilter(event.target.value ?? '');
  };
  const passFilterToQuery = debounce(
    () => setBookUnitQuery({ PageNumber: 1, TitleCn: filter }),
    1000
  );
  useEffect(() => {
    passFilterToQuery();
  }, [filter]);

  const {
    data: bookUnits,
    isValidating: bookUnitsLoading,
    mutate,
  } = getBookUnits(chapter, accessToken, bookUnitQuery);

  return {
    mutate,
    filter,
    bookUnitQuery,
    handleFilterChange,
    handlePageChange,
    bookUnits,
    bookUnitsLoading,
  };
}
