import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const DisseminationMap = () => {



  return (
    <Stack>
      <IconButton color="secondary"><ChevronRightIcon /></IconButton>
      <div id="map-svg"></div>
    </Stack>
  );
};
