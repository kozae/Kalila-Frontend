import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import React, { useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Draggables } from '../drag-layer';
import Box from '@mui/material/Box';

export interface IInsertableUnitProps {
  d: any; // TODO make interface fro bookunit
}

export const InsertableUnit = ({ d }: IInsertableUnitProps) => {
  const [collected, drag, dragPreview] = useDrag<any, any, any>(
    () => ({
      type: Draggables.insertableUnit,
      item: { data: d, type: Draggables.insertableUnit },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [d]
  );
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <Stack
      sx={{
        p: '.1rem',
        m: '.1rem',
        borderRadius: '5px',
        bgcolor: collected.isDragging ? 'primary.light' : 'white',
        cursor: 'grab',
      }}
      direction="row"
      alignItems="center"
      ref={drag}
      role="DraggableBox"
    >
      <Typography variant="body1">
        ({d.OrderInChapter}) {d.Title}
      </Typography>

      {!collected.isDragging && (
        <IconButton color="primary" size="small">
          <EditTwoToneIcon fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
};

export const InsertableUnitDragPreview = ({ d }: IInsertableUnitProps) => {
  return (
    <Box
      sx={{
        p: '.5rem',
        borderRadius: '5px',
        cursor: 'grabbing',
        bgcolor: 'white',
        opacity: 0.8,
      }}
    >
      <Typography variant="body1">
        ({d.OrderInChapter}) {d.Title}
      </Typography>
    </Box>
  );
};
