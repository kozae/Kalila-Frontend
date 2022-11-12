import { Draggables, IItemData } from './drag-layer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useDrop } from 'react-dnd';
import {
  insertUnit,
  kalilaTheme,
  updateBookUnit,
  useAppDispatch,
} from '@frontend/shared-ui';
import { v4 } from 'uuid';

export const AssignAsLacunaContainer = () => {
  const dispatch = useAppDispatch();
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [Draggables.insertableUnit],
    canDrop: (item, monitor) => {
      return item.type !== Draggables.insertableEndTag;
    },
    drop: (item: IItemData) => {
      switch (item.type) {
        case Draggables.insertableUnit:
          dispatch(
            insertUnit({
              Id: v4(),
              BookUnitId: item.data.Id,
              BookUnit: item.data.Title,
              Order: item.data.Order,
              FrameTags: item.data.FrameTags,
              Type: 'n',
              Lacuna: true,
              Start: [-1, -1, -1],
              End: [-1, -1, -1],
            })
          );
          break;
        default:
          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType(),
    }),
  }));

  const message = 'Drop here assign unit as lacuna';
  return (
    <Stack
      ref={drop}
      sx={{
        position: 'fixed',
        bgcolor: 'secondary.light',
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
