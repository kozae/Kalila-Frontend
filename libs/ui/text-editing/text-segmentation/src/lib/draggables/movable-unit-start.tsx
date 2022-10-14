import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { Draggables } from '../drag-layer';
import { useContext, useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  selectTextEditingAccessMode,
  useAppSelector,
} from '@frontend/shared-ui';
import { TextSegmentationContext } from '../context';
import { bookUnitOrderDisplay } from '@frontend/util';

export interface IMovableUnitStartProps {
  d: IUnitSummary;
}

export const MovableUnitStart = ({ d }: IMovableUnitStartProps) => {
  const [{ isDragging }, drag, dragPreview] = useDrag<any, any, any>(
    () => ({
      type: Draggables.movableUnit,
      item: { data: d, type: Draggables.movableUnit },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [d]
  );
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  const { setHoveredUnit } = useContext(TextSegmentationContext);
  return (
    <Typography
      ref={accessMode !== 'view' ? drag : undefined}
      sx={{
        bgcolor: 'secondary.main',
        color: 'white',
        p: '.4rem',
        ml: '.4rem',
        borderRadius: '5px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
      }}
      onMouseEnter={() =>
        setHoveredUnit(
          `(${bookUnitOrderDisplay(d.Order, d.FrameTags, undefined)}) ${
            d.BookUnit
          }`
        )
      }
      onMouseLeave={() => setHoveredUnit(undefined)}
      fontWeight={'600'}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >
      {bookUnitOrderDisplay(d.Order, d.FrameTags, undefined)}
    </Typography>
  );
};

export const MovableUnitStartDragPreview = ({ d }: IMovableUnitStartProps) => {
  return (
    <Typography
      sx={{
        bgcolor: 'secondary.main',
        color: 'white',
        p: '.4rem',
        ml: '.4rem',
        borderRadius: '5px',
        opacity: '.7',
      }}
      fontWeight={'600'}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >
      {bookUnitOrderDisplay(d.Order, d.FrameTags, undefined)}
    </Typography>
  );
};
