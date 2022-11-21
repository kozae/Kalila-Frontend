import { DragSourceMonitor, useDrag } from 'react-dnd';
import { Draggables } from '../drag-layer';
import React, { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Box from '@mui/material/Box';
import {
  selectTextEditingAccessMode,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  return (
    <Stack
      width="48%"
      sx={{
        borderRadius: '5px',
        bgcolor: collected.isDragging ? 'primary.light' : 'primary.dark',
        cursor: 'grab',
        m: '3px',
        p: '3px',
        border: 'solid 1px',
      }}
      ref={
        accessMode.includes('edit') || accessMode.includes('admin')
          ? drag
          : undefined
      }
      role="DraggableBox"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color="white" fontSize="1rem" variant="body1">
        (End)
      </Typography>
    </Stack>
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
        color: 'white',
        cursor: 'grab',
        opacity: '.7',
        fontWeight: 'bold',
      }}
    >
      End
    </Box>
  );
};
