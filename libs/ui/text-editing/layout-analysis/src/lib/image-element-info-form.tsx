import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { ChangeEvent, useEffect } from 'react';

export const ImageElementInfoForm = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value);
  };
  useEffect(() => {
    onChange('image in main body');
  }, []);
  return (
    <FormControl>
      <FormLabel id="radio-buttons-text-element-position-group-label">
        Position:
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-text-element-position-group-label"
        value={value}
        onChange={handleChange}
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
