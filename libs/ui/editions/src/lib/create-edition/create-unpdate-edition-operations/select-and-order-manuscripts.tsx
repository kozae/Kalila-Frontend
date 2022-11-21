import { useSigla } from '../hooks';
import { Sortable } from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import update from 'immutability-helper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import Box from '@mui/material/Box';

const SelectableManuscript = ({
  Siglum,
  Id,
  isSelected,
  onAdd,
  onRemove,
}: any) => {
  return (
    <Stack
      justifyContent="space-between"
      sx={{
        width: '90%',
        bgcolor: isSelected ? 'primary.dark' : 'inherit',
        mt: '3px',
        borderRadius: '5px',
      }}
      direction="row"
    >
      <Typography
        sx={{ pl: '.5rem' }}
        color={isSelected ? 'white' : 'inherit'}
        variant="button"
        fontSize="2rem"
      >
        {Siglum}
      </Typography>
      {!isSelected && (
        <IconButton
          onClick={() => onAdd(Id)}
          color="secondary"
          aria-label="select"
        >
          <ArrowCircleRightTwoToneIcon />
        </IconButton>
      )}
      {isSelected && (
        <IconButton
          onClick={() => onRemove(Id)}
          color="warning"
          aria-label="select"
        >
          <ArrowCircleLeftIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export interface ISelectAndOrderManuscriptsProps {
  selectedManuscripts: string[];
  setSelectedManuscripts: Dispatch<SetStateAction<string[]>>;
}

export const SelectAndOrderManuscripts = ({
  selectedManuscripts,
  setSelectedManuscripts,
}: ISelectAndOrderManuscriptsProps) => {
  const { data: sigla } = useSigla();
  const [filter, setFilter] = useState<string>('');
  const handleAdd = (id: string) => {
    setSelectedManuscripts((prevState) => [...prevState, id]);
  };
  const handleRemove = (id: string) => {
    setSelectedManuscripts((prevState) => [
      ...prevState.filter((m) => m !== id),
    ]);
  };

  const handleMove = (originIndex: number, targetIndex: number) => {
    setSelectedManuscripts((prevState) =>
      update(prevState, {
        $splice: [
          [originIndex, 1],
          [targetIndex, 0, prevState[originIndex]],
        ],
      })
    );
  };

  return (
    <Stack
      justifyContent="space-around"
      sx={{ height: '50vh', width: '80%' }}
      direction="row"
    >
      <Stack
        alignItems="center"
        sx={{ maxHeight: '100%', overflowY: 'scroll', width: '45%' }}
      >
        <Box m="5px" width="100%">
          <TextField
            fullWidth
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterAltTwoToneIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Box>
        {sigla &&
          sigla.content &&
          sigla.content
            .filter((doc: any) =>
              doc.Siglum.toLowerCase().includes(filter.toLowerCase())
            )
            .map((doc: any) => (
              <SelectableManuscript
                key={doc.Id}
                {...doc}
                onAdd={handleAdd}
                onRemove={handleRemove}
                isSelected={selectedManuscripts.includes(doc.Id)}
              />
            ))}
      </Stack>

      <Stack
        alignItems="center"
        sx={{ maxHeight: '100%', overflowY: 'scroll', width: '45%' }}
      >
        {sigla &&
          sigla.content &&
          selectedManuscripts.map((id: string, index) => (
            <Sortable
              key={id}
              id={id}
              index={index}
              move={handleMove}
              style={{ width: '100%' }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: '100%',
                  bgcolor: 'primary.dark',
                  mt: '3px',
                  borderRadius: '5px',
                }}
              >
                <Typography
                  sx={{ pl: '.5rem' }}
                  color="white"
                  bgcolor="primary.dark"
                  variant="button"
                  fontSize="2rem"
                >
                  {sigla.content.find((m: any) => m.Id === id).Siglum}
                </Typography>
              </Stack>
            </Sortable>
          ))}
      </Stack>
    </Stack>
  );
};
