import React from 'react';
import { SxProps } from '@mui/system/styleFunctionSx';
import Box from '@mui/material/Box';
import { useDrop } from 'react-dnd';
import { IChildrenProp } from '../util';

export interface IDropContainerProps extends IChildrenProp {
  accept: string;
  name: string;
  sx: SxProps;
  onDrop: (data: any) => void;
}

export const DropContainer: React.FC<IDropContainerProps> = ({
  children,
  accept,
  name,
  sx,
  onDrop,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: accept,
    drop: (item: any) => {
      onDrop(item.data);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <Box ref={drop} sx={sx}>
      {children}
    </Box>
  );
};
