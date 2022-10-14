import { useDragLayer, XYCoord } from 'react-dnd';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { InsertableEndTagDragPreview } from './draggables';
import { MovableUnitStartDragPreview } from './draggables/movable-unit-start';
import { MovableUnitEndDragPreview } from './draggables/movable-unit-end';
import { DeleteDropContainer } from './delete-drop-container';
import { AssignAsLacunaContainer } from './assign-as-lacuna-container';

export enum Draggables {
  insertableUnit = 'insertableUnit',
  movableUnit = 'movableUnit',
  insertableEndTag = 'insertableEndTag',
  movableEndTag = 'movableEndTag',
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

  const transform = `translate(${x - 5}px, ${y - 5}px)`;
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
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const renderItem = () => {
    switch (itemType) {
      case Draggables.insertableEndTag:
        return <InsertableEndTagDragPreview />;
      case Draggables.movableUnit:
        return <MovableUnitStartDragPreview d={item.data} />;
      case Draggables.movableEndTag:
        return <MovableUnitEndDragPreview d={item.data} />;
      default:
        return null;
    }
  };

  return (
    <Portal>
      {isDragging &&
        [
          Draggables.insertableEndTag,
          Draggables.movableUnit,
          Draggables.movableEndTag,
        ].includes(itemType as any) && (
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
        )}
      {isDragging &&
        [
          Draggables.insertableEndTag,
          Draggables.movableUnit,
          Draggables.movableEndTag,
        ].includes(itemType as any) && (
          <DeleteDropContainer itemType={itemType as Draggables} />
        )}
      {isDragging && itemType === Draggables.insertableUnit && (
        <AssignAsLacunaContainer />
      )}
    </Portal>
  );
};
