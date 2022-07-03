import Stack from '@mui/material/Stack';
import { BookUnit, IChapter } from '@frontend/domain';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import {
  selectAccessToken,
  selectUnitByBuId,
  selectUnitById,
  useAppSelector,
  useBoolean,
} from '@frontend/shared-ui';
import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useBookUnits, useManuscriptUnits } from './hooks';
import IconButton from '@mui/material/IconButton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { InsertableEndTag, InsertableUnit } from './draggables';
import { EditBookUnitDialog } from './dialogs';
import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export interface IUnitsProps {
  chapter: IChapter | null;
}

export const Units = ({ chapter }: IUnitsProps) => {
  const accessToken = useAppSelector(selectAccessToken);
  const [
    editBookUnitDialogIsOpen,
    { setTrue: openEditBookUnitDialog, setFalse: dismissEditBookUnitDialog },
  ] = useBoolean(false);
  const [selectedBookUnit, setSelectedBookUnit] = useState<BookUnit | null>(
    null
  );

  const {
    filter,
    bookUnitQuery,
    handleFilterChange,
    handlePageChange,
    bookUnits,
    bookUnitsLoading,
    mutate,
  } = useBookUnits(chapter, accessToken);
  const handleEditBookUnitClicked = (d: any) => {
    setSelectedBookUnit(
      new BookUnit(d.Id, chapter?.abbr, d.OrderInChapter, d.Title ?? '')
    );
    setTimeout(() => {
      openEditBookUnitDialog();
    }, 100);
  };

  const handleSubmitUpdate = useCallback(
    async (values: BookUnit) => {
      dismissEditBookUnitDialog();
      const newTitle = values.Title?.trim();
      await updateBookUnit(
        values.Id as string,
        {
          Title:
            newTitle && selectedBookUnit?.Title !== newTitle ? newTitle : null,
          OrderInChapter:
            selectedBookUnit?.OrderInChapter !== values.OrderInChapter
              ? values.OrderInChapter
              : null,
          Chapter: values.Chapter,
        },
        accessToken as string
      );
      setTimeout(() => {
        mutate();
      }, 1000);
    },
    [mutate, accessToken, selectedBookUnit]
  );

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
          bookUnits.content.map((d: any) => (
            <UnitTag
              key={d.Id}
              d={d}
              handleEditBookUnit={handleEditBookUnitClicked}
            />
          ))}
        <InsertableEndTag />
      </Stack>
      {selectedBookUnit && (
        <EditBookUnitDialog
          value={selectedBookUnit}
          isOpen={editBookUnitDialogIsOpen}
          onClose={dismissEditBookUnitDialog}
          onSubmit={handleSubmitUpdate}
        />
      )}
    </Stack>
  );
};

export const UnitTag = ({ d, handleEditBookUnit }: any) => {
  const unitInStore = useAppSelector((state) => selectUnitByBuId(state, d.Id));
  if (unitInStore !== undefined) {
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
          ({d.OrderInChapter}) {d.Title} [{unitInStore.Start[0]}]
        </Typography>
        <IconButton size="small" onClick={() => handleEditBookUnit(d)}>
          <EditTwoToneIcon fontSize="small" color="primary" />
        </IconButton>
      </Stack>
    );
  } else {
    return (
      <InsertableUnit onEdit={() => handleEditBookUnit(d)} d={d} key={d.Id} />
    );
  }
};

async function updateBookUnit(id: string, update: any, accessToken: string) {
  await axios.patch(`/server/api/v1/BookUnit/Admin`, update, {
    params: {
      Ids: [id],
    },
    paramsSerializer,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
