import {
  useAuxiliarySurfacesMethods,
  useBehaviorOptions,
  useBehaviorOptionsMethods,
  useSearchData,
  useSearchMethods,
} from '../../contexts';
import { ChangeEvent, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import axios from 'axios';

export const SearchControls = () => {
  const { setCurrentSearchResult, setFilter } = useSearchMethods();
  const { searchResults, currentSearchResult, filter } = useSearchData();
  const { isSearchActive } = useBehaviorOptions();
  const { setIsSearchActive } = useBehaviorOptionsMethods();
  const { setShowSearchHints } = useAuxiliarySurfacesMethods();
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const onNextSearchResult = useCallback(() => {
    setCurrentSearchResult((prev) => {
      if (searchResults && prev < searchResults.length - 1) {
        return prev + 1;
      }
      return 0;
    });
  }, [searchResults]);

  const onPrevSearchResult = useCallback(() => {
    setCurrentSearchResult((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return searchResults ? searchResults.length - 1 : 0;
    });
  }, [searchResults]);

  return isSearchActive ? (
    <Stack direction="row" alignItems="center" width="350px" height="100%">
      <Box width="300px">
        <TextField
          fullWidth
          value={filter}
          onChange={handleFilterChange}
          placeholder="Search unit titles, numbers, or content"
          InputProps={{
            sx: {
              color: 'white',
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </Box>
      {searchResults && (
        <Stack height="100%" direction="row">
          <Stack justifyContent="center" height="100%">
            <ArrowDropUpIcon
              onClick={onPrevSearchResult}
              fontSize="small"
              sx={{ color: 'white', cursor: 'pointer' }}
            />
            <ArrowDropDownIcon
              onClick={onNextSearchResult}
              fontSize="small"
              sx={{ color: 'white', cursor: 'pointer' }}
            />
          </Stack>
          <Stack justifyContent="center" height="100%">
            <Typography fontSize=".5rem" color="white">
              {currentSearchResult + 1}
            </Typography>
            <Typography fontSize=".5rem" color="white">
              of: {searchResults.length}
            </Typography>
          </Stack>
        </Stack>
      )}
      <IconButton
        onClick={() => {
          setShowSearchHints(true);
        }}
      >
        <InfoIcon sx={{ color: 'white' }} />
      </IconButton>
      <IconButton
        onClick={() => {
          setFilter('');
          setIsSearchActive(false);
        }}
      >
        <CloseIcon sx={{ color: 'white' }} />
      </IconButton>
    </Stack>
  ) : (
    <Button
      onClick={() => setIsSearchActive(true)}
      startIcon={<SearchIcon sx={{ color: '#CCCCCC' }} />}
    >
      <Typography color="#CCCCCC" fontSize=".8rem">
        Search...
      </Typography>
    </Button>
  );
};
