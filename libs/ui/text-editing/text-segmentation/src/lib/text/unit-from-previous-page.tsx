import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';

export interface IUnitFromPreviousPageProps {
  d: IUnitSummary;
}

export const UnitFromPreviousPage = ({ d }: IUnitFromPreviousPageProps) => {
  return (
    <Typography
      sx={{
        p: '.4rem',
        ml: '.4rem',
        borderRadius: '5px',
        border: '1px solid black',
      }}
      fontWeight={'600'}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >{`... (${d.BookUnitOrder}) ${d.Chapter} [starts in p. ${d.StartsInPageNumber}]`}</Typography>
  );
};
