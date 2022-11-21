import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { range } from 'lodash';
import { kalilaTheme } from '@frontend/shared-ui';
import { useCallback, useMemo } from 'react';
import { letterMap } from '@frontend/util';
import { useData, useLayoutData, useSearchData } from '../../contexts';
import { WIDTH_OPTIONS } from '../../constants';

export const ManuscriptBar = () => {
  const { size } = useLayoutData();
  const { currentSearchResult, searchResults } = useSearchData();
  const { edition } = useData();
  const fonSize = useMemo(() => {
    switch (size) {
      case 'xs':
        return '1rem';
      case 's':
        return '1.1rem';
      case 'm':
        return '1.2rem';
      case 'l':
        return '1.4rem';
      case 'xl':
        return '1.5rem';
    }
    return '1.5rem';
  }, [size]);

  const isSearchResult = useCallback(
    (msIndex: number) =>
      searchResults &&
      searchResults.length - 1 >= currentSearchResult &&
      searchResults[currentSearchResult][1] === msIndex,
    [currentSearchResult, searchResults]
  );

  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: 'fit-content',
        zIndex: 1,
        boxShadow: kalilaTheme.shadows[4],
      }}
      alignItems="flex-start"
      direction="row"
    >
      {range(edition.get_no_manuscripts()).map((m) => (
        <Stack
          key={m}
          alignItems="center"
          justifyContent="center"
          sx={{
            width: WIDTH_OPTIONS[size],
            bgcolor: isSearchResult(m)
              ? 'rgb(255,103,0)'
              : m % 2
              ? 'white'
              : '#F1F1F1',
          }}
        >
          <Typography
            color={isSearchResult(m) ? 'white' : 'black'}
            p=".5rem"
            fontSize={fonSize}
            fontWeight={600}
          >
            ({letterMap[m]}) {edition.get_ms_siglum(m)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
