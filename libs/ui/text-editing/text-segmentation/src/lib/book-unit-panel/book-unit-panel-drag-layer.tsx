import { useDragLayer, XYCoord } from 'react-dnd';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { useBoolean } from '@frontend/shared-ui';
import { useEffect, useState } from 'react';
import { BookUnit, IBookUnit } from '@frontend/domain';
import { InsertableUnitDragPreview } from '../draggables';
import { DeleteBookUnitDialog } from './dialogs';
import { DeleteBookUnitDropContainer } from './book-unit-delete-drop-container';

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

  const transform = `translate(${x - 10}px, ${y - 10}px)`;
  return {
    width: 'fit-content',
    transform,
    WebkitTransform: transform,
  };
}

export const BookUnitPanelDragLayer = () => {
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
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const [bookUnitSelectedForDeletion, setBookUnitSelectedForDeletion] =
    useState<BookUnit>(new BookUnit('empty'));
  const onBookUnitDelete = (d: IBookUnit) => {
    setBookUnitSelectedForDeletion(
      new BookUnit(d.Id, d.Order, d.Divider, d.Title, d.Variant, d.FrameTags)
    );
    setTimeout(() => openDeleteBookUnitDialog(), 100);
  };

  return (
    <Portal>
      {isDragging && itemType === 'insertableUnit' && (
        <Box
          sx={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 210,
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            cursor: 'grabbing',
          }}
        >
          <div style={getItemStyles(initialOffset, currentOffset)}>
            <InsertableUnitDragPreview d={item.data} />
          </div>
        </Box>
      )}
      {isDragging && itemType === 'insertableUnit' && (
        <DeleteBookUnitDropContainer onDeleteBookUnit={onBookUnitDelete} />
      )}
      <DeleteBookUnitDialog
        key={bookUnitSelectedForDeletion.Id}
        value={bookUnitSelectedForDeletion}
        isOpen={deleteBookUnitDialogIsOpen}
        onClose={() => {
          dismissDeleteBookUnitDialog();
          setBookUnitSelectedForDeletion(new BookUnit('empty'));
        }}
      />
    </Portal>
  );
};
