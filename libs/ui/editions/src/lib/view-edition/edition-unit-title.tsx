import Typography from '@mui/material/Typography';
import { EditionRowTitle } from '../store';
import Stack from '@mui/material/Stack';

export interface IEditionUnitTitleProps {
  data: EditionRowTitle;
}

export const EditionUnitTitle = ({ data }: IEditionUnitTitleProps) => {
  const display = data.get_display();
  return (
    <Stack
      sx={{ width: '100%', bgcolor: 'secondary.light' }}
      direction="row"
      alignItems="flex-start"
    >
      <Typography
        letterSpacing=".2rem"
        sx={{
          p: '5px',
          color: 'white',

          borderRadius: '5px',
          position: 'sticky',
          left: '1%',
        }}
        variant="h5"
        textAlign="center"
        fontWeight="700"
      >
        {display}
      </Typography>
    </Stack>
  );
};
