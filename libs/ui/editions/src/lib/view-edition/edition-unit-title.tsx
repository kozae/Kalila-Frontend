import Typography from '@mui/material/Typography';
import { EditionRowTitle } from '../store';

export interface IEditionUnitTitleProps {
  data: EditionRowTitle;
}

export const EditionUnitTitle = ({ data }: IEditionUnitTitleProps) => {
  const display = data.get_display();
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
