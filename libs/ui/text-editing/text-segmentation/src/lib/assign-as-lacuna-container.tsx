import { Draggables, IItemData } from './drag-layer';
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

export const AssignAsLacunaContainer = () => {
  const dispatch = useAppDispatch();
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [Draggables.insertableUnit, Draggables.movableUnit],
    canDrop: (item, monitor) => {
      return item.type !== Draggables.insertableEndTag;
    },
    drop: (item: IItemData) => {
      switch (item.type) {
        case Draggables.insertableUnit:
          console.log('assign as lacuna');
          break;
        case Draggables.movableUnit:
          console.log('convert to lacuna');
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
        top: '110px',
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
