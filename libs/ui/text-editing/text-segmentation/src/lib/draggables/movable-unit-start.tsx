import { IUnitSummary } from '@frontend/domain';
import Typography from '@mui/material/Typography';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { Draggables, IItemData } from '../drag-layer';
import { useContext, useEffect, useRef } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  closeUnit,
  insertUnit,
  moveUnit,
  replaceUnit,
  selectTextEditingAccessMode,
  swapUnits,
  updateUnit,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { TextSegmentationContext } from '../context';
import { bookUnitOrderDisplay } from '@frontend/util';

export interface IMovableUnitStartProps {
  d: IUnitSummary;
}

export const MovableUnitStart = ({ d }: IMovableUnitStartProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLParagraphElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [Draggables.insertableUnit, Draggables.movableUnit],
    canDrop: (item) => {
      return [Draggables.insertableUnit, Draggables.movableUnit].includes(
        item.type
      );
    },
    drop: (item: IItemData) => {
      switch (item.type) {
        case Draggables.movableUnit:
          dispatch(swapUnits({ first: item.data, second: d }));
          break;
        case Draggables.insertableUnit:
          dispatch(replaceUnit({ msUnit: d, bookUnit: item.data }));
          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

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
  drag(drop(ref));
  return (
    <Typography
      ref={
        accessMode.includes('edit') || accessMode.includes('admin')
          ? ref
          : undefined
      }
      sx={{
        bgcolor: canDrop && isOver ? 'primary.main' : 'secondary.main',
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
