import { IEditionBookUnit } from '@frontend/domain';
import Typography from '@mui/material/Typography';

export interface IEditionUnitTitleProps {
  display: string;
}

export const EditionUnitTitle = ({ display }: IEditionUnitTitleProps) => {
  return (
    <Typography
      letterSpacing=".2rem"
      sx={{
        p: '5px',
        color: 'white',
        bgcolor: 'secondary.light',
        borderRadius: '5px',
      }}
      variant="h5"
      textAlign="center"
      fontWeight="700"
    >
      {display}
    </Typography>
  );
};
