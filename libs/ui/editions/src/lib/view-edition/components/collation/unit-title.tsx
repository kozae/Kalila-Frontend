import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ViewListIcon from '@mui/icons-material/ViewList';
import CompareIcon from '@mui/icons-material/Compare';
import Box from '@mui/material/Box';
import { useMemo } from 'react';
import {
  useAuxiliarySurfacesMethods,
  useData,
  useSearchData,
} from '../../contexts';

export interface IEditionUnitTitleProps {
  unitIdx: number;
}

export const UnitTitle = ({ unitIdx }: IEditionUnitTitleProps) => {
  const { setVisibleHorizontalTextCollation, setVisibleImageCollation } =
    useAuxiliarySurfacesMethods();
  const { rows } = useData();
  const data = rows[unitIdx];
  const display = data.get_display();
  const hasImages = data.get_row_has_images();
  const { searchResults, currentSearchResult } = useSearchData();
  const isSearchResult = useMemo(() => {
    return (
      searchResults &&
      searchResults.length - 1 >= currentSearchResult &&
      searchResults[currentSearchResult][0] === unitIdx
    );
  }, [searchResults, currentSearchResult]);
  return (
    <Stack
      sx={{
        width: '100%',
        bgcolor: isSearchResult ? 'rgb(255,103,0)' : 'info.light',
      }}
      direction="row"
      alignItems="flex-start"
    >
      <Box
        sx={{
          p: '5px',
          color: 'white',
          borderRadius: '5px',
          position: 'sticky',
          left: '1%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography mr="1rem" fontSize="1.3rem" textAlign="center">
          {display}
        </Typography>

        <IconButton
          onClick={() => setVisibleHorizontalTextCollation(unitIdx)}
          size="small"
        >
          <ViewListIcon fontSize="small" sx={{ color: 'white' }} />
        </IconButton>
        {hasImages && (
          <IconButton
            onClick={() => setVisibleImageCollation(unitIdx)}
            size="small"
          >
            <CompareIcon fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
};
