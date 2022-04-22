import { IEditionBookUnit } from '@frontend/domain';
import Typography from '@mui/material/Typography';

export interface IEditionUnitTitleProps {
  bookUnit: IEditionBookUnit;
}

export const EditionUnitTitle = ({ bookUnit }: IEditionUnitTitleProps) => {
  return (
    <Typography sx={{ p: '10px' }} variant="h5">
      ({bookUnit.Order}) {bookUnit.Title}
    </Typography>
  );
};
