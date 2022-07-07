import { ChangeEvent, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const TextElementInfoForm = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel id="radio-buttons-text-element-position-group-label">
        Position:
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-text-element-position-group-label"
        name="radio-buttons-text-element-position-group"
        value={value}
        onChange={handleChange}
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
