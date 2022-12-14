import { IItemData } from './drag-layer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useDrop } from 'react-dnd';
import {
  kalilaTheme,
  removeUnit,
  removeUnitEndTag,
  useAppDispatch,
} from '@frontend/shared-ui';
import { Draggables } from '@frontend/util';
export interface IDeleteDropContainerProps {
  itemType: Draggables;
}

export const DeleteDropContainer = ({
  itemType,
}: IDeleteDropContainerProps) => {
  const dispatch = useAppDispatch();
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [Draggables.movableUnit, Draggables.movableEndTag],
    canDrop: (item, monitor) => {
      return item.type !== Draggables.insertableEndTag;
    },
    drop: (item: IItemData) => {
      switch (item.type) {
        case Draggables.movableUnit:
          dispatch(
            removeUnit({
              msUnitId: item.data.Id,
              bookUnitId: item.data.BookUnitId,
            })
          );
          break;
        case Draggables.movableEndTag:
          dispatch(removeUnitEndTag({ id: item.data.Id }));
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
    itemType === Draggables.movableUnit
      ? 'Drop here to delete Manuscript Unit'
      : 'Drop here to delete unit end tag';
  return (
    <Stack
      ref={drop}
      sx={{
        position: 'fixed',
        bgcolor: 'warning.main',
        height: '80px',
        width: '20vw',
        top: '50px',
        right: '15vw',
        borderRadius: '10px',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
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
