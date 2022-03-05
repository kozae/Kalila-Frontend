import { RefObject } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export const ImageElementInfoForm = ({
  positionInputRef,
}: {
  positionInputRef: RefObject<HTMLInputElement>;
}) => {
  return (
    <FormControl ref={positionInputRef}>
      <FormLabel id="radio-buttons-text-element-position-group-label">
        Position:
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-text-element-position-group-label"
        defaultValue="image in main body"
        name="radio-buttons-text-element-position-group"
      >
        <FormControlLabel
          value="image in main body"
          control={<Radio />}
          label="Image in main body"
        />
        <FormControlLabel
          value="image in margin"
          control={<Radio />}
          label="image in margin"
        />
        <FormControlLabel value="blank" control={<Radio />} label="Blank" />
      </RadioGroup>
    </FormControl>
  );
};
