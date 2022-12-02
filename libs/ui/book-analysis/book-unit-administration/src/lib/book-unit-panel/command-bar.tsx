import Stack from '@mui/material/Stack';
import { useContext, useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { kalilaTheme } from '@frontend/shared-ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import { BookUnitPanelContext } from './book-unit-panel.context';
import IconButton from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { alpha, styled } from '@mui/material';
import FilterFramesTwoToneIcon from '@mui/icons-material/FilterFramesTwoTone';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.secondary.main,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.secondary.main,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export const CommandBar = () => {
  const {
    chapter,
    setChapter,
    filter,
    setFilter,
    setCreateUnitDialogOpen,
    setEditFrameDialogIsOpen,
  } = useContext(BookUnitPanelContext);
  const { accessMode } = useContext(BookUnitPanelContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack
      width="100%"
      boxShadow={kalilaTheme.shadows[4]}
      bgcolor="white"
      zIndex={10}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="0"
    >
      <Button
        color="secondary"
        size="small"
        startIcon={<ArrowBackIcon />}
        onClick={() => setChapter(null)}
      >
        Change chapter
      </Button>
      <Typography
        m="5px"
        bgcolor="primary.dark"
        color="white"
        borderRadius="5px"
        p="5px"
        fontWeight="bold"
        variant="body1"
      >
        {chapter?.name}
      </Typography>
      <TextField
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FilterAltTwoToneIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
      />

      {accessMode === 'admin' && (
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'book-unit-actions-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      )}
      <StyledMenu
        id="book-unit-actions-menu"
        MenuListProps={{
          'aria-labelledby': 'book-unit-actions-menu',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setCreateUnitDialogOpen(true);
          }}
          disableRipple
        >
          <AddBoxIcon />
          Create a Unit...
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setEditFrameDialogIsOpen(true);
          }}
          disableRipple
        >
          <FilterFramesTwoToneIcon />
          Edit a Frame...
        </MenuItem>
      </StyledMenu>
    </Stack>
  );
};
