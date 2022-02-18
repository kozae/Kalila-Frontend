import Checkbox from '@mui/material/Checkbox';
import { ChangeEvent } from 'react';
import {
  addToSelection,
  clearSelection,
  isIdSelected,
  removeFromSelection,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';

export interface ICheckboxCellProps {
  Id: string;
  mode?: 'single' | 'multiple';
}

export const CheckboxCell = ({ Id, mode }: ICheckboxCellProps) => {
  const dispatch = useAppDispatch();
  const checked = useAppSelector(isIdSelected(Id));
  mode = mode ?? 'multiple';
  const handleChange =
    mode === 'multiple'
      ? (event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            dispatch(addToSelection({ id: Id }));
          } else {
            dispatch(removeFromSelection({ id: Id }));
          }
        }
      : (event: ChangeEvent<HTMLInputElement>) => {
          dispatch(clearSelection());
          if (event.target.checked) {
            dispatch(addToSelection({ id: Id }));
          }
        };

  return (
    <Checkbox
      color="secondary"
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
};
