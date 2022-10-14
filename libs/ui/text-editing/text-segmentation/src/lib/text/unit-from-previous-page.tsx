import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { TextSegmentationContext } from '../context';
import { bookUnitOrderDisplay } from '@frontend/util';

export interface IUnitFromPreviousPageProps {
  d: IUnitSummary;
}

export const UnitFromPreviousPage = ({ d }: IUnitFromPreviousPageProps) => {
  const { setHoveredUnit } = useContext(TextSegmentationContext);
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
      onMouseEnter={() => setHoveredUnit(`(${d.Order}) ${d.BookUnit}`)}
      onMouseLeave={() => setHoveredUnit(undefined)}
    >
      {`... (${bookUnitOrderDisplay(
        d.Order,
        d.FrameTags,
        undefined
      )}) [starts in p. ${d.Start[0]}]`}{' '}
      {d.End[0] === -1 && ' Open'}{' '}
    </Typography>
  );
};
