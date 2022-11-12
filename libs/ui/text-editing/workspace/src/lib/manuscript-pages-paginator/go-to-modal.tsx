import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { ChangeEvent, useState } from 'react';
import { intRegEx } from '@frontend/util';

export interface IGotoModalProps {
  open: boolean;
  handleClose: () => void;
  submit: (v: number) => void;
  min: number;
  max: number;
}

export const GoToModal = ({
  min,
  max,
  open,
  handleClose,
  submit,
}: IGotoModalProps) => {
  const [value, setVale] = useState(`${min}`);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (intRegEx.test(event.target.value)) {
      const enteredValue = parseInt(event.target.value);
      if (enteredValue >= min && enteredValue <= max) {
        setVale(event.target.value);
      }
    }
    if (event.target.value.length == 0) {
      setVale(event.target.value);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Stack justifyContent="center" alignItems="center">
          <TextField
            id="outlined-number"
            type="number"
            label="Page"
            InputLabelProps={{
              shrink: true,
            }}
            value={value}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={value.length === 0}
          onClick={() => submit(parseInt(value) as number)}
          autoFocus
        >
          Go
        </Button>
      </DialogActions>
    </Dialog>
  );
};
