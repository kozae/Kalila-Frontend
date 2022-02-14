import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
export const DocumentsDetailedViewControlBar = () => {
  return (
    <Stack direction="row" spacing={0.5}>
      <Button
        color="secondary"
        startIcon={<EditIcon />}
        disableElevation
        variant="text"
      >
        Edit
      </Button>
      <Button
        color="secondary"
        startIcon={<FilterAltOffIcon />}
        disableElevation
        variant="text"
      >
        Clear filters
      </Button>
      <Button
        color="secondary"
        startIcon={<ViewColumnIcon />}
        disableElevation
        variant="text"
      >
        Configure columns...
      </Button>
      <Button
        color="secondary"
        startIcon={<GetAppIcon />}
        disableElevation
        variant="text"
      >
        Export...
      </Button>
    </Stack>
  );
};
