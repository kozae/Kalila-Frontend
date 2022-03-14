import React, { CSSProperties, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { XYCoord, Identifier } from 'dnd-core';

export interface IMovableProps {
  id: string;
  containerId: string;
  index: number;
  move: (
    dragIndex: number,
    hoverIndex: number,
    dragContainerId: string,
    hoverContainerId: string
  ) => void;
  style: CSSProperties;
}

interface DragItem {
  index: number;
  id: string;
  containerId: string;
  type: string;
}

const baseStyle: CSSProperties = {
  cursor: 'move',
};

export const Movable: React.FC<IMovableProps> = ({
  id,
  containerId,
  index,
  move,
  style,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'movable',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      move(dragIndex, hoverIndex, item.containerId, containerId);

      item.index = hoverIndex;
      item.containerId = containerId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'movable',
    item: () => {
      return { id, index, containerId };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{ ...baseStyle, opacity, ...style }}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
};
