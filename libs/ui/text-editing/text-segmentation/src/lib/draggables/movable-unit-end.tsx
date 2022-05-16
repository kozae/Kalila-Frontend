import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { Draggables } from '../drag-layer';
import { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  removeUnit,
  removeUnitEndTag,
  selectTextEditingAccessMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';

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
      ref={accessMode !== 'view' ? drag : undefined}
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
    >{`(${d.BookUnitOrder}.End) ${d.Chapter}`}</Typography>
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
    >{`(${d.BookUnitOrder}.End) ${d.BookUnit}`}</Typography>
  );
};
