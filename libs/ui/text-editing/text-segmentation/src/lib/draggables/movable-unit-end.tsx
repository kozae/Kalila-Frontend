import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { Draggables } from '@frontend/util';
import { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  selectTextEditingAccessMode,
  useAppSelector,
} from '@frontend/shared-ui';
import { bookUnitOrderDisplay } from '@frontend/util';

export interface IUnitEndProps {
  d: IUnitSummary;
}

export const MovableUnitEnd = ({ d }: IUnitEndProps) => {
  const [{ isDragging }, drag, dragPreview] = useDrag<any, any, any>(
    () => ({
      type: Draggables.movableEndTag,
      item: { data: d, type: Draggables.movableEndTag },
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
  return (
    <Typography
      ref={
        accessMode.includes('edit') || accessMode.includes('admin')
          ? drag
          : undefined
      }
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        p: '.4rem',
        ml: '.4rem',
        borderRadius: '5px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
      }}
      fontWeight={'600'}
      letterSpacing="0.08rem"
      fontSize="1rem"
      variant="body1"
    >{`${bookUnitOrderDisplay(
      d.Order,
      d.FrameTags,
      undefined
    )}.End`}</Typography>
  );
};

export const MovableUnitEndDragPreview = ({ d }: IUnitEndProps) => {
  return (
    <Typography
      sx={{
        bgcolor: 'primary.dark',
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
    >{`(${bookUnitOrderDisplay(d.Order, d.FrameTags, undefined)}.End) ${
      d.BookUnit
    }`}</Typography>
  );
};
