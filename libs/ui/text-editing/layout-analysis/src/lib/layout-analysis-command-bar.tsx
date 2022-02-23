import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { kalilaTheme } from '@frontend/shared-ui';

export const LayoutAnalysisCommandBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      sx={{
        width: '100%',
        bgcolor: 'white',
        boxShadow: kalilaTheme.shadows[4],
      }}
      justifyContent="center"
      alignItems="center"
      direction="row"
      spacing={1}
    >
      <>
        <Button
          id="add-layout-element-menu-btn"
          onClick={handleClick}
          startIcon={<AddIcon />}
          endIcon={<ArrowDropDownIcon />}
          variant="text"
          size="small"
          color="secondary"
        >
          Add
        </Button>
        <Menu
          id="add-layout-element-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'add-layout-element-menu-btn',
          }}
        >
          <MenuItem onClick={handleClose}>
            <TextSnippetTwoToneIcon /> &nbsp; Text Element
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <InsertPhotoTwoToneIcon /> &nbsp; Image Element
          </MenuItem>
        </Menu>
      </>
      <Button
        color="secondary"
        size="small"
        startIcon={<EditTwoToneIcon />}
        variant="text"
      >
        Edit
      </Button>
      <Button
        size="small"
        startIcon={<DeleteForeverTwoToneIcon />}
        variant="text"
        color="warning"
      >
        Delete
      </Button>
    </Stack>
  );
};
