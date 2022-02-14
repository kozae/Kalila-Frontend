import Checkbox from '@mui/material/Checkbox';
import { ChangeEvent, useCallback, useState } from 'react';

export interface ICheckboxCellProps {
  Id: string;
  selection: Set<string>;
  setSelection: (Ids: Set<string>) => void;
}

export const CheckboxCell = ({
  Id,
  selection,
  setSelection,
}: ICheckboxCellProps) => {
  const [checked, setChecked] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        selection.add(Id);
      } else {
        selection.delete(String(Id));
      }
      setSelection(new Set<string>(selection));
      setChecked(event.target.checked);
    },
    [selection]
  );

  return (
    <Checkbox
      color="secondary"
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
};
