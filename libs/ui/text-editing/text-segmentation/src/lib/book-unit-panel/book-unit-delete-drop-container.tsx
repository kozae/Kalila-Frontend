import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useDrop } from 'react-dnd';
import { kalilaTheme } from '@frontend/shared-ui';
export interface IDeleteDropContainerProps {
  onDeleteBookUnit: (d: any) => void;
}

export const DeleteBookUnitDropContainer = ({
  onDeleteBookUnit,
}: IDeleteDropContainerProps) => {
  const [{}, drop] = useDrop(() => ({
    accept: ['insertableUnit'],
    canDrop: (item, monitor) => {
      return item.type === 'insertableUnit';
    },
    drop: (item: any) => {
      onDeleteBookUnit(item.data);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType(),
    }),
  }));

  return (
    <Stack
      ref={drop}
      sx={{
        position: 'fixed',
        bgcolor: 'warning.main',
        height: '100px',
        width: '30vw',
        top: '10px',
        left: '10vw',
        borderRadius: '10px',
        zIndex: 20,
        boxShadow: kalilaTheme.shadows[4],
      }}
      alignItems="center"
      justifyContent="center"
    >
      <DeleteTwoToneIcon htmlColor="white" fontSize="large" />
      <Typography color="white" variant="h4">
        Drop here to attempt to delete Book Unit
      </Typography>
    </Stack>
  );
};
