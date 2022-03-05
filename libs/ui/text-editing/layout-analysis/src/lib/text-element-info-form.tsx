import { RefObject } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const TextElementInfoForm = ({
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
        defaultValue="main body"
        name="radio-buttons-text-element-position-group"
      >
        <FormControlLabel
          value="main body"
          control={<Radio />}
          label="Main body"
        />
        <FormControlLabel
          value="main text in margin"
          control={<Radio />}
          label="Main text in margin"
        />
        <FormControlLabel value="gloss" control={<Radio />} label="Gloss" />
        <FormControlLabel value="legend" control={<Radio />} label="Legend" />
        <FormControlLabel value="poem" control={<Radio />} label="Poem" />
        <FormControlLabel
          value="side title"
          control={<Radio />}
          label="Side title"
        />
        <FormControlLabel value="stamp" control={<Radio />} label="Stamp" />
        <FormControlLabel
          value="correction in margin"
          control={<Radio />}
          label="Correction in margin"
        />
      </RadioGroup>
    </FormControl>
  );
};
