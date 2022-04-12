import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';

export interface IUnitStartProps {
  d: IUnitSummary;
}

export const UnitStart = ({ d }: IUnitStartProps) => {
  return (
    <Typography
      sx={{
        bgcolor: 'secondary.main',
        color: 'white',
        p: '.4rem',
        ml: '.4rem',
        borderRadius: '5px',
      }}
      fontWeight={'600'}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >{`(${d.BookUnitOrder}) ${d.Chapter}`}</Typography>
  );
};
