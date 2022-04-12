import { useDragLayer, XYCoord } from 'react-dnd';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import {
  InsertableEndTagDragPreview,
  InsertableUnitDragPreview,
} from './draggables';

export enum Draggables {
  insertableUnit = 'insertableUnit',
  insertableEndTag = 'insertableEndTag',
}

export interface IItemData {
  data: any;
  type: Draggables;
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    width: 'fit-content',
    transform,
    WebkitTransform: transform,
  };
}

export const DragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const renderItem = () => {
    switch (itemType) {
      case Draggables.insertableUnit:
        return <InsertableUnitDragPreview d={item.data} />;
      case Draggables.insertableEndTag:
        return <InsertableEndTagDragPreview />;
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }
  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 200,
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          cursor: 'grabbing',
        }}
      >
        <div style={getItemStyles(initialOffset, currentOffset)}>
          {renderItem()}
        </div>
      </Box>
    </Portal>
  );
};
