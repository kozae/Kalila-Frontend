import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import React, { useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Draggables } from '../drag-layer';
import Box from '@mui/material/Box';
import { bookUnitOrderDisplay } from '@frontend/util';
import { IBookUnit } from '@frontend/domain';
import {
  selectTextEditingAccessMode,
  useAppSelector,
} from '@frontend/shared-ui';

export interface IInsertableUnitProps {
  d: IBookUnit;
  onEdit: () => void;
}

export const InsertableUnit = ({ d, onEdit }: IInsertableUnitProps) => {
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
  const accessMode = useAppSelector(selectTextEditingAccessMode);
  return (
    <Stack
      width="48%"
      sx={{
        borderRadius: '5px',
        bgcolor: collected.isDragging ? 'primary.light' : 'white',
        cursor: 'grab',
        m: '3px',
        p: '3px',
        border: 'solid 1px',
      }}
      direction="column"
      alignItems="center"
      ref={
        accessMode.includes('edit') || accessMode.includes('admin')
          ? drag
          : undefined
      }
      role="DraggableBox"
    >
      <Stack
        position="relative"
        width="100%"
        justifyContent="center"
        direction="row"
      >
        <Typography fontSize="1rem" variant="body1">
          {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)} [
          {d.Order.map((i) => `${i}.`)}]
        </Typography>
        {(accessMode.includes('book_unit_admin') ||
          accessMode.includes('admin')) &&
          !collected.isDragging && (
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={onEdit}
              color="primary"
              size="small"
            >
              <EditTwoToneIcon fontSize="small" />
            </IconButton>
          )}
      </Stack>
      <Typography fontSize="1rem" variant="body1">
        {d.Title}
      </Typography>
    </Stack>
  );
};

export const InsertableUnitDragPreview = ({ d }: { d: any }) => {
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
        ( {bookUnitOrderDisplay(d.Order, d.FrameTags, d.Variant)}) {d.Title}
      </Typography>
    </Box>
  );
};
