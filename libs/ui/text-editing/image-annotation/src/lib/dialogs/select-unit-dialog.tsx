import Modal from '@mui/material/Modal';
import { DialogHeading } from '@frontend/shared-ui';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system/styleFunctionSx';
import { IChapter, CHAPTERS } from '@frontend/domain';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import Button from '@mui/material/Button';
const style: SxProps = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  minWidth: '300px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

export interface ISelectUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (v: any) => Promise<void> | void;
  units?: any[];
}

export const SelectUnitDialog = ({
  isOpen,
  onClose,
  onSubmit,
  units,
}: ISelectUnitDialogProps) => {
  const [filter, setFilter] = useState<string>('');

  return (
    <Portal>
      <Modal open={isOpen} onClose={onClose}>
        <Stack alignItems="center" sx={style}>
          <DialogHeading onDismiss={onClose}>
            <Typography color="white" variant="h5">
              Select book chapter
            </Typography>
          </DialogHeading>
          <Stack mt="10px" alignItems="center" justifyContent="center">
            <TextField
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
            <Stack
              mt="10px"
              direction="row"
              flexWrap="wrap"
              justifyContent="space-between"
              maxHeight="70vh"
              sx={{
                overflowY: 'scroll',
              }}
            >
              {units &&
                units
                  .filter((u) =>
                    u.Title.toLowerCase().includes(filter.toLowerCase())
                  )
                  .map((u) => (
                    <Button
                      color="secondary"
                      sx={{ m: '5px', width: '45%' }}
                      variant="outlined"
                      key={u.Title}
                      onClick={() => onSubmit(u)}
                    >
                      ({u.OrderInChapter}) {u.Title}
                    </Button>
                  ))}
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </Portal>
  );
};
