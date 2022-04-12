import { DragSourceMonitor, useDrag } from 'react-dnd';
import { Draggables } from '../drag-layer';
import React, { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Box from '@mui/material/Box';

export const InsertableEndTag = () => {
  const [collected, drag, dragPreview] = useDrag<any, any, any>(() => ({
    type: Draggables.insertableEndTag,
    item: { type: Draggables.insertableEndTag },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <Box
      sx={{
        p: '.5rem',
        m: '.1rem',
        borderRadius: '5px',
        bgcolor: collected.isDragging ? 'primary.light' : 'primary.dark',
        color: collected.isDragging ? 'black' : 'white',
        cursor: 'grab',
      }}
      ref={drag}
    >
      End
    </Box>
  );
};

export const InsertableEndTagDragPreview = () => {
  return (
    <Box
      sx={{
        p: '.5rem',
        m: '.1rem',
        borderRadius: '5px',
        bgcolor: 'primary.light',
        color: 'black',
        cursor: 'grab',
        opacity: '.7',
      }}
    >
      End
    </Box>
  );
};
