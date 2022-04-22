import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system/styleFunctionSx';
import { useDrag } from 'react-dnd';

export interface IDraggableProps {
  sx: SxProps;
  itemType: string;
  data: any;
}

export const Draggable: React.FC<IDraggableProps> = ({
  children,
  sx,
  data,
  itemType,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemType,
    item: { data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  const opacity = isDragging ? 0 : 1;
  return (
    <Box ref={drag} sx={{ ...sx, opacity }}>
      {children}
    </Box>
  );
};
