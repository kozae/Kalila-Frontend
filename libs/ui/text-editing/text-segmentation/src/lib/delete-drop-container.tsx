import { Draggables, IItemData } from './drag-layer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useDrop } from 'react-dnd';
export interface IDeleteDropContainerProps {
  itemType: Draggables;
  onDeleteBookUnit: (d: any) => void;
}

export const DeleteDropContainer = ({
  itemType,
  onDeleteBookUnit,
}: IDeleteDropContainerProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [
      Draggables.insertableUnit,
      Draggables.movableUnit,
      Draggables.movableEndTag,
    ],
    canDrop: (item, monitor) => {
      return item.type !== Draggables.insertableEndTag;
    },
    drop: (item: IItemData) => {
      switch (item.type) {
        case Draggables.insertableUnit:
          onDeleteBookUnit(item.data);
          break;
        case Draggables.movableUnit:
          break;
        case Draggables.movableEndTag:
          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType(),
    }),
  }));

  const message =
    itemType === Draggables.insertableUnit
      ? 'Drop here to attempt to delete Book Unit'
      : itemType === Draggables.movableUnit
      ? 'Drop here to delete Manuscript Unit'
      : itemType === Draggables.movableEndTag
      ? 'Drop here to delete unit end tag'
      : '';
  return (
    <Stack
      ref={drop}
      sx={{
        position: 'fixed',
        bgcolor: 'warning.main',
        height: '100px',
        width: '300px',
        top: '110px',
        right: 'calc(30vw - 200px)',
        borderRadius: '10px',
        zIndex: 10,
      }}
      alignItems="center"
      justifyContent="center"
    >
      <DeleteTwoToneIcon htmlColor="white" fontSize="large" />
      <Typography color="white" variant="h4">
        {message}
      </Typography>
    </Stack>
  );
};
