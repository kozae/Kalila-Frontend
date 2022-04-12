import Stack from '@mui/material/Stack';
import { IChapter } from '@frontend/domain';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import {
  selectAccessToken,
  selectCurrentPageNumber,
  useAppSelector,
} from '@frontend/shared-ui';
import React from 'react';
import Typography from '@mui/material/Typography';
import { useBookUnits, useManuscriptUnits } from './hooks';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { InsertableEndTag, InsertableUnit } from './draggables';

export interface IUnitsProps {
  chapter: IChapter | null;
}

export const Units = ({ chapter }: IUnitsProps) => {
  const accessToken = useAppSelector(selectAccessToken);
  const currentPageNumber = useAppSelector(selectCurrentPageNumber);
  const {
    filter,
    bookUnitQuery,
    handleFilterChange,
    handlePageChange,
    bookUnits,
    bookUnitsLoading,
  } = useBookUnits(chapter, accessToken);
  const msUnitsMap = useManuscriptUnits(chapter, accessToken);

  return (
    <Stack alignItems="center">
      <Stack
        sx={{ width: '100%' }}
        justifyContent="space-between"
        alignItems="center"
        direction="row"
      >
        <TextField
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAltIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
        {bookUnitsLoading && (
          <Stack justifyContent="center" sx={{ width: '50%', height: '100%' }}>
            <LinearProgress color="secondary" />
          </Stack>
        )}
        {bookUnits && bookUnits.pagination && (
          <Pagination
            page={bookUnitQuery.PageNumber}
            onChange={handlePageChange}
            count={bookUnits.pagination.totalPages}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        )}
      </Stack>
      <Stack
        sx={{ width: '100%' }}
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {bookUnits &&
          bookUnits.content &&
          bookUnits.content.map((d: any) => {
            if (msUnitsMap && msUnitsMap.get(d.Id)) {
              return (
                <Stack
                  key={d.Id}
                  sx={{
                    p: '.1rem',
                    m: '.1rem',
                    borderRadius: '5px',
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                  }}
                  direction="row"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    ({d.OrderInChapter}) {d.Title} [
                    {msUnitsMap.get(d.Id)?.StartsInPageNumber}]
                  </Typography>
                  <IconButton color="primary" size="small">
                    <EditTwoToneIcon fontSize="small" />
                  </IconButton>
                  {msUnitsMap.get(d.Id)?.StartsInPageNumber ===
                    currentPageNumber && (
                    <IconButton color="warning" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              );
            } else {
              return <InsertableUnit d={d} key={d.Id} />;
            }
          })}
        <InsertableEndTag />
      </Stack>
    </Stack>
  );
};
