import { useDragLayer, XYCoord } from 'react-dnd';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import {
  InsertableEndTagDragPreview,
  InsertableUnitDragPreview,
} from './draggables';
import { MovableUnitStartDragPreview } from './draggables/movable-unit-start';
import { MovableUnitEndDragPreview } from './draggables/movable-unit-end';
import { DeleteDropContainer } from './delete-drop-container';
import { useBoolean } from '@frontend/shared-ui';
import { DeleteBookUnitDialog } from './dialogs';
import { useState } from 'react';
import { BookUnit } from '@frontend/domain';

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

  const transform = `translate(${x}px, ${y}px)`;
  return {
    width: 'fit-content',
    transform,
    WebkitTransform: transform,
  };
}

export const DragLayer = () => {
  const [
    deleteBookUnitDialogIsOpen,
    {
      setTrue: openDeleteBookUnitDialog,
      setFalse: dismissDeleteBookUnitDialog,
    },
  ] = useBoolean(false);
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
      case Draggables.movableUnit:
        return <MovableUnitStartDragPreview d={item.data} />;
      case Draggables.movableEndTag:
        return <MovableUnitEndDragPreview d={item.data} />;
      default:
        return null;
    }
  };

  const [bookUnitSelectedForDeletion, setBookUnitSelectedForDeletion] =
    useState<BookUnit>(new BookUnit());
  const onBookUnitDelete = (d: any) => {
    setBookUnitSelectedForDeletion(
      new BookUnit(d.Id, d.Chapter, d.OrderInChapter, d.Title)
    );
    setTimeout(() => openDeleteBookUnitDialog(), 100);
  };

  return (
    <Portal>
      {isDragging && (
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
      {isDragging && (
        <DeleteDropContainer
          onDeleteBookUnit={onBookUnitDelete}
          itemType={itemType as Draggables}
        />
      )}
      <DeleteBookUnitDialog
        value={bookUnitSelectedForDeletion}
        isOpen={deleteBookUnitDialogIsOpen}
        onClose={dismissDeleteBookUnitDialog}
      />
    </Portal>
  );
};
